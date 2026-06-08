import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from google import genai

# === Load Environment Variables ====
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found in .env file")


# === Gemini Client ===
client = genai.Client(api_key=api_key)


# === FastAPI App === 

app = FastAPI(
    title="Civiclens AI Service"
)


# === Request Models === 

class ComplaintRequest(BaseModel):
    title: str
    description: str


# === AI Functions === 

def categorize_complaint(title: str, description: str):

    prompt = f"""
    You are an expert civic complaint classifier.

    Complaint Title:
    {title}

    Complaint Description:
    {description}

    Classify the complaint into ONLY ONE category from:

    - Road Maintenance
    - Waste Management
    - Water Supply
    - Street Lighting
    - Drainage
    - Public Safety
    - Infrastructure
    - Other

    Also provide a categoryReason in 1-2 sentences explaining why this category was selected.

    Return ONLY valid JSON.

    Example:

    {{
        "category": "Road Maintenance",
        "categoryReason": "The complaint concerns damage to a public road affecting commuters and transportation."
    }}

    Both category and categoryReason are mandatory.
    Do not omit any field.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Remove markdown if Gemini adds it
    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    result = json.loads(text)

    if "category" not in result:
        raise ValueError("Gemini did not return category")

    if "categoryReason" not in result:
        raise ValueError("Gemini did not return categoryReason")

    return result


def detect_priority(title: str, description: str):

    prompt = f"""
    You are an expert civic complaint analyst.

    Complaint Title:
    {title}

    Complaint Description:
    {description}

    Determine the priority level of this complaint.

    Allowed priorities:

    - Low
    - Medium
    - High
    - Critical

    Also provide a priorityReason in 1-2 sentences explaining why this priority was assigned.

    Return ONLY valid JSON.

    Example:

    {{
        "priority": "High",
        "priorityReason": "The issue poses a risk to public safety and requires prompt attention."
    }}

    Both priority and priorityReason are mandatory.
    Do not omit any field.
    """


    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )


    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    result = json.loads(text)

    if "priority" not in result:
        raise ValueError("Gemini did not return priority")

    if "priorityReason" not in result:
        raise ValueError("Gemini did not return priorityReason")

    return result


def extract_entities(title: str, description: str):

    prompt = f"""
    Extract important entities from this civic complaint.

    Complaint Title:
    {title}

    Complaint Description:
    {description}

    Allowed entity types:

    - location
    - issue
    - landmark
    - organization

    Return ONLY valid JSON.

    Example:

    {{
      "entities": [
        {{
          "entity": "IIIT Sonepat Gate",
          "type": "location"
        }},
        {{
          "entity": "Pothole",
          "type": "issue"
        }}
      ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    return json.loads(text)


def generate_summary(title: str, description: str):

    prompt = f"""
    You are an expert civic complaint summarizer.

    Complaint Title:
    {title}

    Complaint Description:
    {description}

    Generate a professional summary.

    Rules:

    - Length should be 40 to 60 words.
    - Mention the main issue.
    - Mention the impact on citizens.
    - Mention the location if available.
    - Keep the tone official and professional.

    Return ONLY valid JSON.

    Example:

    {{
        "summary": "A large pothole near IIIT Sonepat Gate is causing road safety concerns and increasing the risk of accidents for daily commuters and nearby residents."
    }}

    summary is mandatory.
    Do not omit any field.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    result = json.loads(text)

    if "summary" not in result:
        raise ValueError("Gemini did not return summary")

    return result


# === Routes ===
@app.get("/")
def root():
    return {
        "message": "Civiclens AI Running"
    }


@app.post("/analyze")
async def analyze_complaint(request: ComplaintRequest):

    try:

        # Category Classification
        category_result = categorize_complaint(
            request.title,
            request.description
        )

        # Priority Detection
        priority_result = detect_priority(
            request.title,
            request.description
        )

        # Entities
        entities_result = extract_entities(
            request.title,
            request.description
        )

        # Summary
        summary_result = generate_summary(
            request.title,
            request.description
        )

        # Return combined response
        return {
            "title": request.title,
            "category": category_result["category"],
            "categoryReason": category_result["categoryReason"],

            "priority": priority_result["priority"],
            "priorityReason": priority_result["priorityReason"],

            "summary": summary_result["summary"],
            "entities": entities_result['entities']
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )