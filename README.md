# 🏛️ CivicLens — AI Powered Civic Intelligence System

CivicLens is an **AI-powered civic complaint intelligence platform** that transforms unstructured citizen complaints into structured, actionable reports using **Natural Language Processing (NLP)** and **Computer Vision**.

Instead of simply collecting complaints, CivicLens intelligently understands the issue, detects the complaint language, classifies the category, identifies the responsible government department, determines urgency, extracts important entities, generates an official complaint letter, and provides practical recommendations for both citizens and civic authorities.

The project follows a **production-ready microservice architecture**, where the React frontend, Node.js backend, and FastAPI AI service are independently deployed and communicate securely through REST APIs.

<img width="900" height="300" alt="Dark_Theme_logo" src="https://github.com/user-attachments/assets/ad440d93-5d2a-4735-9d5a-09e5cc6bfb6d" />

# 🏛️ CivicLens — Overview

<img width="1254" height="1254" alt="image" src="https://github.com/user-attachments/assets/f8d715ee-c8c1-44c5-95af-43bf1eb2a73d" />


# 🏛️ CivicLens — Architechture

<img width="1232" height="393" alt="Untitled Diagram drawio" src="https://github.com/user-attachments/assets/5b3023f7-d48c-4f73-b19a-d63cc67eff28" />


## ✨ Key Features

### 🤖 AI Powered Complaint Intelligence

#### 🧠 Natural Language Understanding

* Automatic Language Detection
* Complaint Category Classification
* Priority Detection (Low / Medium / High / Critical)
* Smart Complaint Summarization
* Named Entity Extraction
* AI Generated Citizen Advisory
* Potential Risk Identification
* Estimated Resolution Time Prediction


#### 🏢 Intelligent Department Recommendation

* Automatically identifies the most relevant government department
* Generates explanation for department selection
* Eliminates manual complaint routing
  

#### 📝 AI Generated Complaint Letter

* Generates professionally formatted complaint letters
* Formal government-ready language
* Includes complaint subject and detailed body
* Reduces manual drafting effort


#### 🖼️ Visual Evidence Analysis

* AI-based infrastructure damage detection
* Public hazard identification
* Visual evidence interpretation
* Severity estimation
* Confidence score generation


#### 📂 Complaint History Management

* Secure complaint storage
* View previously analyzed complaints
* Access complete AI reports anytime


#### 🔐 Secure Authentication

* JWT-based Authentication
* Protected Routes
* User-specific complaint history
* Secure backend APIs

## 🚀 Technology Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Framer Motion
* Axios
* React Router DOM
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

### AI Service

* FastAPI
* Google Gemini API
* Python
* Pillow
* Python Multipart

### Deployment

* Frontend → Vercel
* Backend → Render
* AI Service → Render
* Database → MongoDB Atlas


# 📱 Application Screenshots

## 🏠 Landing Page

<img width="1638" height="915" alt="image" src="https://github.com/user-attachments/assets/b69ceb94-e6e3-4441-805e-d0ecbf2c9bc9" />


## 📝 Complaint Submission

<img width="1455" height="921" alt="image" src="https://github.com/user-attachments/assets/7fa43fa3-2193-48af-a8f0-09e041d1d808" />


## 🤖 AI Complaint Analysis
<img width="1663" height="917" alt="image" src="https://github.com/user-attachments/assets/84640ca5-ea1b-49d3-b853-62d60c5ebad8" />

## 🤖 AI Analysis Results
<img width="1576" height="915" alt="image" src="https://github.com/user-attachments/assets/45052bfb-69ac-412d-a78d-15be85c28a05" />
<img width="1551" height="913" alt="image" src="https://github.com/user-attachments/assets/2ea6a9e5-ad86-4504-a7dd-45ef0c235440" />
<img width="1546" height="925" alt="image" src="https://github.com/user-attachments/assets/1199024e-3041-469d-982f-e4c85589fa62" />


## 🖼️ Visual Evidence Analysis

<img width="1411" height="916" alt="image" src="https://github.com/user-attachments/assets/7d0b2ac4-2416-4861-a519-ac384a3a506c" />


## 📄 AI Generated Complaint Letter

<img width="1475" height="915" alt="image" src="https://github.com/user-attachments/assets/c2a97a1a-6bbf-4c90-9029-ad64a3af584c" />


## 📂 Complaint History

<img width="1385" height="917" alt="image" src="https://github.com/user-attachments/assets/16627dbf-f63a-4e5d-837f-44697332283a" />


## 🌐 Live Demo

**🔗 Link:** *https://civiclens-two.vercel.app/*

## 📋 Prerequisites

Before running the project locally, ensure the following software is installed:

* Node.js (v18 or above)
* Python (v3.10 or above)
* npm
* Git
* MongoDB Atlas Account
* Google Gemini API Keys


# ⚡ Quick Start (Local Setup)

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/gtushar8055/CivicLens.git
cd CivicLens
```

## 2️⃣ Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

### AI Service

```bash
cd ai-services
pip install -r requirements.txt
```

## 3️⃣ Environment Variables

### Backend (.env)

```env
MONGO_URI=
JWT_SECRET=
```

### AI Service (.env)

```env
GEMINI_API_KEY_1=
GEMINI_API_KEY_2=
GEMINI_API_KEY_3=
```

## 4️⃣ Run the Application

### Backend

```bash
cd backend
npm run dev
```

### AI Service

```bash
cd ai-services
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

# 📁 Project Structure

```
CivicLens/

├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── ai-services/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# 🧠 Important Engineering Learnings

* Production deployment using independent frontend, backend, and AI services
* Building scalable AI microservice architecture with FastAPI
* JWT Authentication using protected React routes
* REST API communication between multiple services
* AI prompt engineering for structured JSON generation
* Gemini API key failover mechanism for improved reliability
* MongoDB Atlas cloud integration
* Environment variable management across multiple deployments
* Render deployment for backend and AI services
* Vercel deployment with React (Vite)

---

# 🚀 Deployment

### Frontend → Vercel
### Backend → Render
### AI Service → Render


# 🚀 Future Enhancements or Possibilities

* Live Complaint Status Tracking
* GIS Based Complaint Mapping
* Government Portal Integration
* Email & SMS Notifications
* Voice-based Complaint Registration
* Multi-language Translation
* Analytics Dashboard for Municipal Authorities
* AI Chat Assistant for Citizens
* Mobile Application Support


# 💡 Project Highlights

* AI-first civic complaint analysis platform
* End-to-end NLP pipeline
* Computer Vision based evidence analysis
* Intelligent department recommendation
* Automatic complaint letter generation
* Secure JWT authentication
* Cloud-native deployment architecture
* Responsive modern UI
* Modular microservice design
* Production-ready implementation

# 👨‍💻 Developer

**Tushar Gupta**

B.Tech Information Technology

Indian Institute of Information Technology, Sonepat

GitHub:
https://github.com/gtushar8055

LinkedIn:
*https://www.linkedin.com/in/tushar-gupta-546790296/*

Email:
[tushargupta12312021@gmail.com](mailto:tushargupta12312021@gmail.com)


# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Your support motivates continued development and future improvements.


# 📄 License

This project is developed for educational, academic, and research purposes.

© 2026 Tushar Gupta. All Rights Reserved.

