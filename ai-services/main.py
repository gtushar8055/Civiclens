import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File , Form
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

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

        Support all major Indian languages.
        Return the detected language name exactly as its English language name.
        Examples include (but are not limited to):

        - English
        - Hindi
        - Punjabi
        - Tamil
        - Telugu
        - Kannada
        - Malayalam
        - Marathi
        - Bengali
        - Gujarati
        - Odia
        - Assamese
        - Urdu

        Generate EVERY output entirely in the detected language.
        Never mix multiple languages in the same response.
        Never translate the response into English unless the original complaint is in English.

        Language Consistency Rules:

        All generated fields must be in the detected language, including:

        - Category
        - Category Reason
        - Priority
        - Priority Reason
        - Summary
        - Entity Types
        - Department Name
        - Department Reason
        - Complaint Subject
        - Complaint Body
        - Complaint Closing

        Do not leave any field in English unless the complaint itself is in English.

   1. Category must represent one of the following concepts:

        - Road Maintenance
        - Waste Management
        - Water Supply
        - Street Lighting
        - Drainage
        - Public Safety
        - Infrastructure
        - Other

        Return ONLY the translated category name in the detected language.

        Examples:
        English → Waste Management
        Hindi → कचरा प्रबंधन
        Tamil → கழிவு மேலாண்மை
        Telugu → వ్యర్థ నిర్వహణ

    2. Return the translated priority level in the detected language.

    Priority concepts are:

        - Low
        - Medium
        - High
        - Critical

        Examples:
        English → Critical
        Hindi → अत्यंत उच्च
        Tamil → மிக அவசரம்
        Telugu → అత్యవసరం

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

    Entity Requirements:

    - Extract between 3 and 10 meaningful entities whenever possible.
    - Each entity must contain both:
    - entity
    - type
    - Generate both entity and type in the detected language.
    - Do not translate entity types into English unless the original complaint is in English.
    - Avoid duplicate entities.
    - Prefer meaningful entity types such as:
    - Location
    - Infrastructure
    - Affected Group
    - Time
    - Environmental Factor
    - Safety Risk
    - Government Asset

    7. Generate a detailed complaint letter.

    8. Complaint Letter Requirements:

    - Use formal, official and professional language.
    - Generate a detailed complaint letter.
    - The body must contain at least two meaningful paragraphs.
    - The first paragraph should clearly explain the issue.
    - The second paragraph should explain its impact on citizens and request prompt action.
    - Mention the location if available.
    - Do NOT include any fake personal information.
    - Keep placeholders for future citizen details.
    - Generate the ENTIRE complaint in the detected language.
    - Never mix multiple languages in the complaint.
    - The subject, body, closing, placeholders and every sentence must be in the same language.

        Closing Instructions:

        End the complaint using an appropriate formal closing in the detected language.

        For example:

        If English:
        Kindly look into this matter and take the necessary action at the earliest.

        Yours faithfully,

        [Citizen Name]
        Address: [Citizen Address]
        Phone: [Citizen Phone Number]

        For every other language (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu, etc.), generate the complete closing naturally and professionally in that same language, including the citizen detail placeholders.

    9. Recommend the most suitable government department and explain why.

    detectedLanguage is mandatory.
    Do not omit any field.
    Return ONLY valid JSON.
    Do not include markdown, explanations or code fences.
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

def analyze_image_with_ai(image , language):

    prompt = f"""
    You are an expert civic infrastructure inspector.
    The detected complaint language is:
    {language}
    Generate EVERY field strictly in this language.
    Never mix multiple languages.

    Return ONLY valid JSON.
    You are an expert civic infrastructure inspector.

    Analyze the image and return ONLY valid JSON.

    {{
    "detectedIssues": [],
    "imageSummary": "",
    "visualEvidence": "",
    "confidenceScore": 0.0
    }}

    Return severity in the detected language.

        Concepts:
        Low
        Medium
        High
        Critical
        
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
        result = analyze_image_with_ai(image , "English")
        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.post("/analyze-complete")
async def analyze_complete(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...)
):

    try:
        image = Image.open(file.file)
        text_result = analyze_complaint_with_ai(
            title,
            description
        )
        language = text_result["detectedLanguage"]
        image_result = analyze_image_with_ai(
            image, 
            language
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