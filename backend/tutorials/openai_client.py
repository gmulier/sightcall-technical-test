from openai import OpenAI
import json
from django.conf import settings


def generate_tutorial_from_transcript(phrases: list) -> dict:
    """
    Generate structured tutorial with video clips from transcript phrases using OpenAI.
    
    Args:
        phrases (list): List of transcript phrases with timing data
        
    Returns:
        dict: Structured tutorial data with steps containing optional video_clip:
            - title: Tutorial title
            - introduction: Introduction paragraph  
            - steps: List of steps with text, index, timestamp, and optional video_clip
            - tips: List of practical tips
            - summary: Summary paragraph
            - duration_estimate: Estimated completion time
            - tags: List of relevant keywords
    """
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Send raw JSON transcript directly to OpenAI
    raw_transcript_json = json.dumps(phrases, indent=2)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": settings.OPENAI_SYSTEM_PROMPT
            },
            {
                "role": "user", 
                "content": settings.OPENAI_USER_PROMPT_TEMPLATE.format(transcript_json=raw_transcript_json)
            }
        ],
        max_tokens=4096,
        temperature=0.2,
        top_p=0.9,
    )
    
    # Parse JSON response from OpenAI
    raw_content = response.choices[0].message.content.strip()
    
    try:
        return json.loads(raw_content)
    except json.JSONDecodeError as e:
        raise ValueError(f"OpenAI response is not valid JSON: {e}")


 