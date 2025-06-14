import json
from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_tutorial_from_transcript(text: str) -> dict:
    """
    Génère un tutoriel structuré à partir du texte d'un transcript.
    Retourne un dictionnaire avec les clés : title, introduction, steps, examples, summary, duration_estimate, tags, content_md
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": settings.OPENAI_SYSTEM_PROMPT
            },
            {
                "role": "user", 
                "content": settings.OPENAI_USER_PROMPT_TEMPLATE.format(text=text)
            }
        ],
        max_tokens=1200,
        temperature=0.7,
    )
    
    # Parse le JSON retourné par l'IA
    raw_content = response.choices[0].message.content.strip()
    try:
        return json.loads(raw_content)
    except json.JSONDecodeError as e:
        # Fallback si l'IA ne retourne pas du JSON valide
        raise ValueError(f"OpenAI response is not valid JSON: {e}") 