from openai import OpenAI
import json
from django.conf import settings


def generate_tutorial_from_transcript(text: str) -> dict:
    """
    Generate structured tutorial content from transcript text using OpenAI
    
    Takes raw transcript text and uses OpenAI's GPT model to generate
    a comprehensive tutorial with structured sections and markdown content.
    
    Args:
        transcript_text (str): Raw text extracted from conversation transcript
        
    Returns:
        dict: Structured tutorial data with the following keys:
            - title: Tutorial title
            - introduction: Introduction paragraph
            - steps: List of step-by-step instructions
            - examples: List of practical examples
            - summary: Summary paragraph
            - duration_estimate: Estimated completion time
            - tags: List of relevant keywords
            
    Raises:
        Exception: If OpenAI API call fails or returns invalid data
    """
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

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