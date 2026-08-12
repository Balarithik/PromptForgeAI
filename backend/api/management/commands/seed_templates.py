from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import PromptTemplate, TemplateVersion

class Command(BaseCommand):
    help = 'Seeds standard 10 AI prompt templates into the database'

    def handle(self, *args, **options):
        templates = [
            {
                'name': 'SEO Blog Article',
                'category': 'seo',
                'description': 'Search engine optimized blog post designed to rank high for primary and secondary keywords with rich headers and strategic keyword density.',
                'system_prompt': 'You are a master SEO copywriter and digital strategist. Create engaging, high-ranking search engine optimized blog content with natural keyword integration, compelling H2/H3 subheadings, meta descriptions, and bullet points.',
                'user_prompt_template': 'Write a comprehensive SEO blog post on the topic: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nPrimary Keywords: {primary_keywords}\nSecondary Keywords: {secondary_keywords}\n\nInclude a meta title idea, meta description, engaging introduction, structured sections with H2/H3 tags, natural keyword placement, and a concluding call-to-action.',
                'variables': [
                    {'name': 'primary_keywords', 'label': 'Primary Keywords', 'type': 'text', 'placeholder': 'e.g. AI blog generator, SEO tools'},
                    {'name': 'secondary_keywords', 'label': 'Secondary Keywords', 'type': 'text', 'placeholder': 'e.g. content marketing, AI copywriting'}
                ],
                'is_default': True
            },
            {
                'name': 'Technical Article',
                'category': 'technical',
                'description': 'Deep-dive technical article with code snippets, architecture breakdowns, data flows, and performance benchmarks for software engineers.',
                'system_prompt': 'You are a Principal Software Architect and technical writer. Craft authoritative, accurate technical articles with runnable code snippets, clear architectural diagrams in markdown or mermaid syntax, and performance considerations.',
                'user_prompt_template': 'Write a deep technical article on: "{topic}".\n\nTarget Audience: {target_audience} (Developers / Architects)\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nTech Stack / Frameworks: {tech_stack}\nCode Language: {code_language}\n\nProvide practical code blocks, architectural explanations, best practices, error handling strategies, and performance benchmarks.',
                'variables': [
                    {'name': 'tech_stack', 'label': 'Tech Stack / Frameworks', 'type': 'text', 'placeholder': 'e.g. React, Django, PostgreSQL'},
                    {'name': 'code_language', 'label': 'Code Block Language', 'type': 'text', 'placeholder': 'e.g. python, javascript'}
                ],
                'is_default': False
            },
            {
                'name': 'Tutorial / How-To Guide',
                'category': 'tutorial',
                'description': 'Step-by-step instructional guide with clear prerequisites, numbered actionable steps, code/command examples, and troubleshooting tips.',
                'system_prompt': 'You are an instructional designer and technical educator. Create easy-to-follow, step-by-step tutorials that guide readers from setup to complete working implementation.',
                'user_prompt_template': 'Write a comprehensive step-by-step tutorial on: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nPrerequisites: {prerequisites}\nExpected Outcome: {expected_outcome}\n\nInclude prerequisites, Step 1..N numbered breakdown, exact commands/code, and a common pitfalls troubleshooting section.',
                'variables': [
                    {'name': 'prerequisites', 'label': 'Prerequisites', 'type': 'text', 'placeholder': 'e.g. Node.js 18+, Docker installed'},
                    {'name': 'expected_outcome', 'label': 'Expected Outcome', 'type': 'text', 'placeholder': 'e.g. Deployable REST API'}
                ],
                'is_default': False
            },
            {
                'name': 'Academic Article',
                'category': 'academic',
                'description': 'Rigorously structured research-style article complete with abstract, methodology, comparative analysis, citations, and formal academic tone.',
                'system_prompt': 'You are a Senior Academic Researcher and Professor. Write formal academic papers adhering to scholarly standards, structured headers (Abstract, Introduction, Theoretical Framework, Discussion, Conclusion), and inline citations.',
                'user_prompt_template': 'Write a scholarly academic paper on: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone} (Formal / Academic)\nLanguage: {language}\nTarget Length: {target_length}\nResearch Focus: {research_focus}\nMethodology: {methodology}\n\nInclude an Abstract, Introduction, Literature Review / Background, Analysis / Discussion, Implications, and Reference list.',
                'variables': [
                    {'name': 'research_focus', 'label': 'Research Focus', 'type': 'text', 'placeholder': 'e.g. LLM latency vs accuracy tradeoffs'},
                    {'name': 'methodology', 'label': 'Methodology', 'type': 'text', 'placeholder': 'e.g. Empirical benchmark & comparative analysis'}
                ],
                'is_default': False
            },
            {
                'name': 'News Article',
                'category': 'news',
                'description': 'Fast-paced, journalistic news story using the inverted pyramid structure (Who, What, When, Where, Why) with quotes and industry implications.',
                'system_prompt': 'You are a veteran journalist and news editor. Craft sharp, objective news reports following journalistic integrity, lead paragraphs, key quotes, and context.',
                'user_prompt_template': 'Write a breaking news report on: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone} (Objective / Journalistic)\nLanguage: {language}\nTarget Length: {target_length}\nKey Event / Release: {key_event}\nFeatured Quote / Perspective: {featured_quote}\n\nFollow the Inverted Pyramid model: Lead hook, crucial details, background context, industry reactions, and future outlook.',
                'variables': [
                    {'name': 'key_event', 'label': 'Key Event / Announcement', 'type': 'text', 'placeholder': 'e.g. Launch of Gemini 2.5 Flash model'},
                    {'name': 'featured_quote', 'label': 'Quote or Perspective', 'type': 'text', 'placeholder': 'e.g. "This sets a new speed benchmark for real-time AI."'}
                ],
                'is_default': False
            },
            {
                'name': 'Explainer Article',
                'category': 'explainer',
                'description': 'Breaks down complex or abstract concepts into simple, intuitive mental models, real-world analogies, and digestible breakdowns.',
                'system_prompt': 'You are a master communicator who excels at demystifying complex concepts. Explain abstract topics using intuitive analogies, progressive disclosure, and clear visuals.',
                'user_prompt_template': 'Write an intuitive Explainer article on: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nAnalogy / Metaphor Idea: {analogy_idea}\n\nStart with a "TL;DR" summary, explain "Why it matters", use the primary analogy to build intuition, break down key terminology, and end with real-world applications.',
                'variables': [
                    {'name': 'analogy_idea', 'label': 'Analogy / Metaphor', 'type': 'text', 'placeholder': 'e.g. Compare APIs to waiters in a restaurant'}
                ],
                'is_default': False
            },
            {
                'name': 'Case Study',
                'category': 'case_study',
                'description': 'Results-driven enterprise case study following the Challenge -> Solution -> Results framework with key metrics and metrics callouts.',
                'system_prompt': 'You are a B2B Content Strategist and Enterprise Case Study Writer. Produce convincing case studies highlighting measurable ROI, business impact, and transformational outcomes.',
                'user_prompt_template': 'Write a B2B enterprise Case Study on: "{topic}".\n\nTarget Audience: {target_audience} (Executives / Deciders)\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nClient / Industry: {client_industry}\nCore Metrics Achieved: {metrics_achieved}\n\nStructure as: Client Profile, The Challenge, The Solution Implemented, Key Quantitative Results (callout metrics), and Client Testimonial quote.',
                'variables': [
                    {'name': 'client_industry', 'label': 'Client Company / Industry', 'type': 'text', 'placeholder': 'e.g. FinTech Enterprise'},
                    {'name': 'metrics_achieved', 'label': 'Key ROI / Metrics Achieved', 'type': 'text', 'placeholder': 'e.g. 400% ROI, 70% reduction in processing time'}
                ],
                'is_default': False
            },
            {
                'name': 'Product Review',
                'category': 'product_review',
                'description': 'Unbiased, in-depth evaluation of a tool or SaaS platform detailing pros, cons, key features, pricing breakdown, and final buying verdict.',
                'system_prompt': 'You are an independent product reviewer and tech critic. Provide thorough, objective reviews evaluating usability, pricing, features, pros & cons, and target user fit.',
                'user_prompt_template': 'Write an in-depth Product Review for: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone}\nLanguage: {language}\nTarget Length: {target_length}\nProduct Name: {product_name}\nKey Competitors: {competitors}\nVerdict Rating: {verdict_rating}\n\nInclude: Executive Overview, Key Feature Breakdown, Pros & Cons List, Pricing & Value, Competitor Comparison matrix, and Final Verdict rating.',
                'variables': [
                    {'name': 'product_name', 'label': 'Product Name', 'type': 'text', 'placeholder': 'e.g. PromptForge AI Platform'},
                    {'name': 'competitors', 'label': 'Key Competitors', 'type': 'text', 'placeholder': 'e.g. Jasper AI, Copy.ai'},
                    {'name': 'verdict_rating', 'label': 'Verdict Score / Rating', 'type': 'text', 'placeholder': 'e.g. 4.8 / 5 Stars'}
                ],
                'is_default': False
            },
            {
                'name': 'Developer Documentation',
                'category': 'documentation',
                'description': 'Clean technical API / SDK documentation with usage guides, endpoint parameters, code samples, and response schemas.',
                'system_prompt': 'You are a Senior Technical Writer specializing in Developer Documentation. Create clear, concise documentation with accurate endpoint tables, parameter descriptions, and code blocks.',
                'user_prompt_template': 'Write comprehensive Developer Documentation for: "{topic}".\n\nTarget Audience: {target_audience} (Developers)\nTone: {tone} (Technical / Concise)\nLanguage: {language}\nTarget Length: {target_length}\nComponent / API Name: {component_name}\n\nInclude: Overview, Architecture / Flow, Configuration / Environment Variables, API Methods / Endpoints reference, Code Usage Examples, and Error Codes table.',
                'variables': [
                    {'name': 'component_name', 'label': 'Component / Service Name', 'type': 'text', 'placeholder': 'e.g. PromptEngine API'}
                ],
                'is_default': False
            },
            {
                'name': 'LinkedIn / Social Media Article',
                'category': 'linkedin',
                'description': 'High-converting, viral social article formatted with punchy hooks, line breaks, bullet points, call-to-actions, and strategic hashtags.',
                'system_prompt': 'You are a viral LinkedIn creator and personal branding strategist. Craft punchy, highly engaging posts designed for maximum dwell time, comments, and shares.',
                'user_prompt_template': 'Write a viral LinkedIn Article / Thought Leadership post on: "{topic}".\n\nTarget Audience: {target_audience}\nTone: {tone} (Conversational / Inspiring)\nLanguage: {language}\nTarget Length: {target_length}\nCore Insight / Hot Take: {core_takeaway}\n\nInclude: Attention-grabbing first line hook, spacing for mobile readability, bullet points for key takeaways, question prompt for comments, and 4-6 relevant hashtags.',
                'variables': [
                    {'name': 'core_takeaway', 'label': 'Core Insight / Takeaway', 'type': 'text', 'placeholder': 'e.g. AI won\'t replace engineers, engineers using AI will.'}
                ],
                'is_default': False
            }
        ]

        count = 0
        for data in templates:
            slug = slugify(data['name'])
            tmpl, created = PromptTemplate.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': data['name'],
                    'category': data['category'],
                    'description': data['description'],
                    'system_prompt': data['system_prompt'],
                    'user_prompt_template': data['user_prompt_template'],
                    'variables': data['variables'],
                    'is_default': data.get('is_default', False),
                    'version': 1
                }
            )
            if created:
                TemplateVersion.objects.create(
                    template=tmpl,
                    version=1,
                    system_prompt=tmpl.system_prompt,
                    user_prompt_template=tmpl.user_prompt_template,
                    variables=tmpl.variables,
                    changelog='Seeded default prompt template'
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new prompt templates ({PromptTemplate.objects.count()} total in DB).'))
