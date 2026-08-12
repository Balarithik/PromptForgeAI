import re

class PromptEngine:
    """
    Dynamic prompt engine responsible for rendering prompt templates with custom variables,
    fallback validation, and schema formatting.
    """

    @staticmethod
    def extract_variables(template_str):
        """Extract all {variable} tokens from a prompt template string."""
        if not template_str:
            return []
        pattern = r'\{([a-zA-Z0-9_]+)\}'
        return list(set(re.findall(pattern, template_str)))

    @staticmethod
    def render(template_str, variables_dict):
        """
        Safely replace {var_name} in template_str with values from variables_dict.
        If a variable is missing, keep empty string or default fallback.
        """
        if not template_str:
            return ""

        rendered = template_str
        extracted = PromptEngine.extract_variables(template_str)

        for var in extracted:
            val = variables_dict.get(var, "")
            if val is None:
                val = ""
            rendered = rendered.replace(f"{{{var}}}", str(val))

        return rendered

    @staticmethod
    def format_full_prompt(template, form_data):
        """
        Builds system_prompt and user_prompt for a given PromptTemplate model instance and user input dictionary.
        """
        # Merged dict combining standard form parameters + template specific variables
        merged_vars = {
            'topic': form_data.get('topic', ''),
            'target_audience': form_data.get('target_audience', 'General Audience'),
            'tone': form_data.get('tone', 'Professional'),
            'language': form_data.get('language', 'English'),
            'target_length': form_data.get('target_length', 'Medium (~1000 words)'),
            'custom_instructions': form_data.get('custom_instructions', ''),
        }

        # Override or add custom variables passed in variables_values
        if 'variables_values' in form_data and isinstance(form_data['variables_values'], dict):
            merged_vars.update(form_data['variables_values'])

        rendered_system = PromptEngine.render(template.system_prompt, merged_vars)
        rendered_user = PromptEngine.render(template.user_prompt_template, merged_vars)

        if form_data.get('custom_instructions'):
            rendered_user += f"\n\nAdditional Instructions: {form_data.get('custom_instructions')}"

        return rendered_system, rendered_user
