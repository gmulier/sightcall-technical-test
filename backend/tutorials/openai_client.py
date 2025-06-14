from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_tutorial_from_transcript(phrases: list) -> str:
    """
    Génère un tutoriel à partir des phrases d'un transcript.
    Extrait uniquement le texte pertinent des phrases.
    """
    # Extraction optimale du texte des phrases
    text = "\n".join(phrase["display"] for phrase in phrases if phrase.get("display"))
    
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
        max_tokens=800,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip() 