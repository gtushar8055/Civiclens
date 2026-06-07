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

    Return ONLY valid JSON.

    Example:

    {{
      "category": "Road Maintenance"
    }}
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

    return json.loads(text)


# === Routes ===
@app.get("/")
def root():
    return {
        "message": "Civiclens AI Running"
    }


@app.post("/analyze")
async def analyze_complaint(request: ComplaintRequest):

    try:

        category_result = categorize_complaint(
            request.title,
            request.description
        )

        return {
            "title": request.title,
            "category": category_result["category"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )