import os
import json
import time
import random
import requests
from typing import Optional
from django.conf import settings

class AIService:
    """
    Core AI Service interfacing with Google Gemini API for article generation,
    multi-stage pipelines, evaluation, and inline AI editing tools.
    """

    MODEL_CANDIDATES = [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite"
    ]

    # Configurable defaults (can be overridden via env or Django settings)
    DEFAULT_MODEL = os.environ.get('GEMINI_API_MODEL') or getattr(settings, 'GEMINI_API_MODEL', MODEL_CANDIDATES[0])
    MAX_RETRIES = int(os.environ.get('GEMINI_MAX_RETRIES', getattr(settings, 'GEMINI_MAX_RETRIES', 5)))
    TIMEOUT = int(os.environ.get('GEMINI_TIMEOUT', getattr(settings, 'GEMINI_TIMEOUT', 60)))
    ENABLE_STREAMING = os.environ.get('GEMINI_ENABLE_STREAMING', getattr(settings, 'GEMINI_ENABLE_STREAMING', 'false')).lower() in ('1', 'true', 'yes')

    def API_STATUS(MODEL_CANDIDATES=MODEL_CANDIDATES):
        api_key = getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')

        if not api_key:
            print("[Gemini API Service] Notice: GEMINI_API_KEY is missing in backend environment / .env file.")
            return False, "NO_API_KEY"

        model_candidates = [x for x in MODEL_CANDIDATES]

        # 1. Try google-generativeai SDK if available
        try:
            import google.genai as genai
            genai.configure(api_key=api_key)
            for model in model_candidates:
                print("Checking model:", model)
                model_instance = genai.GenerativeModel(model)
                result = model_instance.generate_content("Explain how AI works in a few words")
                if result and hasattr(result, "text"):
                    return True, f"Successful with model {model}"
                else:
                    return False, "Failed"
        except Exception as e:
            return False, f"An Error Occured {e}"

    @classmethod
    def _call_gemini(cls, system_instruction, user_prompt, model: Optional[str] = None, streaming: bool = False):
        """
        Calls Google Gemini API server-side using google-generativeai SDK or direct REST endpoints.
        Tries valid Gemini model candidates in order.
        """
        api_key = getattr(settings, 'GEMINI_API_KEY', '') or os.environ.get('GEMINI_API_KEY', '')

        if not api_key:
            print("[Gemini API Service] Notice: GEMINI_API_KEY is missing in backend environment / .env file.")
            return None, "NO_API_KEY"

        model_candidates = [model] if model else cls.MODEL_CANDIDATES

        # 1. Try google-generativeai SDK if available
        try:
            import google.genai as genai
            genai.configure(api_key=api_key)
            for model_name in model_candidates:
                attempt = 0
                while attempt < cls.MAX_RETRIES:
                    try:
                        model_instance = genai.GenerativeModel(model_name)
                        response = model_instance.generate_content(user_prompt)

                        text = None
                        if response is None:
                            text = None
                        elif hasattr(response, "text"):
                            text = response.text
                        elif isinstance(response, dict):
                            candidates = response.get("candidates") or response.get("outputs")
                            if candidates and isinstance(candidates, list):
                                first = candidates[0]
                                text = first.get("content") or first.get("text") or first.get("output")

                        if text:
                            print(f"[Gemini API SDK Success] Generated content using model '{model_name}'")
                            return text, "SUCCESS"

                        break
                    except Exception as e:
                        attempt += 1
                        if attempt < cls.MAX_RETRIES:
                            backoff = (2 ** attempt) + random.random()
                            print(f"[Gemini SDK transient error] attempt {attempt} for {model_name}: {e}; retrying in {backoff:.1f}s")
                            time.sleep(backoff)
                            continue
                        else:
                            print(f"[Gemini SDK Candidate Error] Model '{model_name}' failed after {attempt} attempts: {e}")
                            break
        except ImportError:
            # SDK not installed; will fall back to REST
            pass

        # 2. Fallback to direct HTTP REST calls across model candidates
        headers = {'Content-Type': 'application/json'}
        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": float(os.environ.get('GEMINI_TEMPERATURE', getattr(settings, 'GEMINI_TEMPERATURE', 0.7))),
                "topP": float(os.environ.get('GEMINI_TOP_P', getattr(settings, 'GEMINI_TOP_P', 0.95))),
                "maxOutputTokens": int(os.environ.get('GEMINI_MAX_OUTPUT_TOKENS', getattr(settings, 'GEMINI_MAX_OUTPUT_TOKENS', 8192)))
            }
        }

        for model_name in model_candidates:
            attempt = 0
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            while attempt < cls.MAX_RETRIES:
                try:
                    response = requests.post(url, headers=headers, json=payload, timeout=cls.TIMEOUT)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get('candidates', [])
                        if candidates:
                            first = candidates[0]
                            content = first.get('content') or first.get('output') or first
                            if isinstance(content, dict):
                                parts = content.get('parts', [])
                                if parts and isinstance(parts, list):
                                    part0 = parts[0]
                                    text = part0.get('text') or part0.get('content')
                                    if text:
                                        print(f"[Gemini API REST Success] Generated content using model '{model_name}'")
                                        return text, "SUCCESS"
                            elif isinstance(content, str):
                                return content, "SUCCESS"
                        print(f"[Gemini REST Warning] Model '{model_name}' returned 200 but no text candidate found: {data}")
                        break
                    else:
                        status = response.status_code
                        text_snip = (response.text or '')[:200]
                        if status in (429, 500, 502, 503, 504) and attempt + 1 < cls.MAX_RETRIES:
                            attempt += 1
                            backoff = (2 ** attempt) + random.random()
                            print(f"[Gemini REST transient status {status}] retry {attempt} in {backoff:.1f}s: {text_snip}")
                            time.sleep(backoff)
                            continue
                        print(f"[Gemini REST Candidate Warning] Model '{model_name}' returned status {status}: {text_snip}")
                        break
                except requests.RequestException as e:
                    attempt += 1
                    if attempt < cls.MAX_RETRIES:
                        backoff = (2 ** attempt) + random.random()
                        print(f"[Gemini REST Exception] attempt {attempt} for {model_name}: {e}; retrying in {backoff:.1f}s")
                        time.sleep(backoff)
                        continue
                    print(f"[Gemini REST Exception] Model '{model_name}' failed after {attempt} attempts: {e}")
                    break

        return None, "API_CALL_FAILED"
