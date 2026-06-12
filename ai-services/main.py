import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from PIL import Image
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
    imageUrl: str | None = None


# === AI Functions === 

def analyze_complaint_with_ai(title: str, description: str):

    prompt = f"""
    You are an advanced Civic Intelligence AI.

    Complaint Title:
    {title}

    Complaint Description:
    {description}

    Generate ALL outputs in the SAME language as the complaint.

    Return ONLY valid JSON in this exact format:

    {{
        
        "detectedLanguage": "",
        "category": "",
        "categoryReason": "",

        "priority": "",
        "priorityReason": "",

        "summary": "",

        "entities": [
            {{
                "entity": "",
                "type": ""
            }}
        ],

        "draftComplaint": {{
            "subject": "",
            "body": ""
        }},

        "recommendedDepartment": {{
            "department": "",
            "reason": ""
        }}
    }}

    RULES:

    0. Detect the language of the complaint.

    Return language name such as:

    - English
    - Hindi
    - Punjabi
    - Tamil
    - Telugu
    - Bengali
    - Marathi
    - Gujarati

Generate ALL outputs in the SAME language as the complaint.

    1. Category must be one of:
       - Road Maintenance
       - Waste Management
       - Water Supply
       - Street Lighting
       - Drainage
       - Public Safety
       - Infrastructure
       - Other

    2. Priority:
       - Low
       - Medium
       - High
       - Critical

    3. CategoryReason should be 20-40 words.

    4. PriorityReason should be 20-40 words.

    5. Summary should be 40-60 words.

        Summary Requirements:

    - Length should be 40 to 60 words.
    - Mention the main issue.
    - Mention the impact on citizens.
    - Mention the location if available.
    - Keep the tone official and professional.

    6. Extract important entities.

    7. Generate a detailed complaint letter.

    8. Complaint letter requirements:

     - Use formal and professional language.
     - Generate a detailed complaint letter.
     - The body should contain at least 2 meaningful paragraphs.
     - First paragraph should explain the issue in detail.
     - Second paragraph should explain the impact on citizens and request urgent action.
     - Mention location if available.
     - Request prompt action from the concerned authority.
     - Do NOT include any fake personal information.
     - Keep placeholders for future user details.
     - Generate response in the same language as the complaint.

       End with:

       Kindly look into this matter and take the necessary action at the earliest.

       Yours faithfully,

       [Citizen Name]
       Address: [Citizen Address]
       Phone: [Citizen Phone Number]

    9. Recommend the most suitable department and explain why.


    detectedLanguage is mandatory.
    Do not omit any field.
    Return ONLY JSON.
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

def analyze_image_with_ai(image):

    prompt = """
    You are an expert civic infrastructure inspector.

    Analyze the image and return ONLY valid JSON.

    {
    "detectedIssues": [],
    "category": "",
    "priority": "",
    "recommendedDepartment": "",
    "imageSummary": "",
    "visualEvidence": "",
    "confidenceScore": 0.0
    }

    Severity must be:
    - Low
    - Medium
    - High
    - Critical

    Category must be one of:

    - Road Maintenance
    - Waste Management
    - Water Supply
    - Street Lighting
    - Drainage
    - Public Safety
    - Infrastructure

    Priority must be:

    - Low
    - Medium
    - High
    - Critical

    Recommend the most appropriate government department.

    Confidence score must be between 0 and 1.

    Focus only on civic issues such as:

    - Potholes
    - Road Damage
    - Water Leakage
    - Garbage Accumulation
    - Broken Street Lights
    - Drainage Problems
    - Public Infrastructure Damage
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, image]
    )

    text = response.text.strip()

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

        result = analyze_complaint_with_ai(
            request.title,
            request.description
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

    try:

        image = Image.open(file.file)
        result = analyze_image_with_ai(image)
        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.post("/analyze-complete")
async def analyze_complete(
    title: str,
    description: str,
    file: UploadFile = File(...)
):

    try:
        image = Image.open(file.file)
        text_result = analyze_complaint_with_ai(
            title,
            description
        )
        image_result = analyze_image_with_ai(
            image
        )
        return {
            "textAnalysis": text_result,
            "imageAnalysis": image_result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )