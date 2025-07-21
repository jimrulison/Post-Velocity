from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from pathlib import Path
import uuid
import json
from datetime import datetime

# Load environment variables
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
MONGO_URL = os.getenv('MONGO_URL')
MUSIC_API_KEY = os.getenv('MUSIC_API_KEY')
AITURBO_API_KEY = os.getenv('AITURBO_API_KEY')

# Create FastAPI app
app = FastAPI(title="PostVelocity", description="AI-Powered Social Media Management Platform")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files
frontend_build_path = Path("../frontend/build")
if frontend_build_path.exists():
    try:
        app.mount("/static", StaticFiles(directory=str(frontend_build_path / "static")), name="static")
        app.mount("/", StaticFiles(directory=str(frontend_build_path), html=True), name="frontend")
    except Exception as e:
        print(f"Warning: Could not mount static files: {e}")

# Security
security = HTTPBearer(auto_error=False)

class ContentRequest(BaseModel):
    company_id: str
    topic: str
    platforms: List[str]
    audience_level: str = "general"

class Company(BaseModel):
    id: str
    name: str
    industry: str
    description: Optional[str] = None

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "PostVelocity API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/companies")
async def get_companies():
    """Get list of companies"""
    return [
        {
            "id": "demo-company-1",
            "name": "Tech Innovators Inc",
            "industry": "Technology",
            "description": "Leading technology company"
        },
        {
            "id": "demo-company-2", 
            "name": "Green Energy Solutions",
            "industry": "Energy",
            "description": "Sustainable energy provider"
        },
        {
            "id": "demo-company-3",
            "name": "Creative Marketing Agency",
            "industry": "Marketing",
            "description": "Full-service marketing agency"
        }
    ]

@app.post("/api/generate-content")
async def generate_content(request: ContentRequest):
    """Generate AI-powered social media content"""
    generated_content = []
    
    for platform in request.platforms:
        if platform == "instagram":
            content = f"🚀 Exciting update about {request.topic}! Our team is working hard to bring you the latest innovations. Stay tuned for more! #Innovation #Growth #Success"
        elif platform == "facebook":
            content = f"We're thrilled to share insights about {request.topic}. This represents a significant step forward in our mission to provide exceptional value to our community."
        elif platform == "linkedin":
            content = f"Professional insight: {request.topic} is shaping the future of our industry. Here's what business leaders need to know about this important development."
        elif platform == "twitter":
            content = f"Breaking: {request.topic} is transforming how we approach business. Key insights for leaders 🧵 #Leadership #Innovation"
        else:
            content = f"Check out our latest update about {request.topic}! We're excited to share this with our community."
            
        generated_content.append({
            "platform": platform,
            "content": content,
            "hashtags": ["#PostVelocity", "#SocialMedia", "#AI", "#Innovation"],
            "engagement_prediction": 85,
            "optimal_time": "2:00 PM"
        })
    
    return {"generated_content": generated_content}

@app.get("/api/analytics/overview")
async def get_analytics_overview():
    """Get analytics overview"""
    return {
        "total_posts": 1247,
        "engagement_rate": 4.2,
        "total_reach": 125000,
        "conversions": 234,
        "roi_percentage": 340,
        "top_platform": "Instagram",
        "growth_rate": 15.3
    }

@app.get("/api/platforms/connected")
async def get_connected_platforms():
    """Get connected social media platforms"""
    platforms = [
        {"name": "Instagram", "connected": True, "followers": 12500},
        {"name": "Facebook", "connected": True, "followers": 8900},
        {"name": "LinkedIn", "connected": False, "followers": 0},
        {"name": "Twitter", "connected": True, "followers": 5600},
        {"name": "TikTok", "connected": False, "followers": 0},
        {"name": "YouTube", "connected": True, "followers": 15200}
    ]
    return {"platforms": platforms}

@app.get("/api/user/profile")
async def get_user_profile():
    """Get user profile information"""
    return {
        "name": "Demo User",
        "email": "demo@postvelocity.com",
        "plan": "Professional",
        "usage": {
            "posts_this_month": 45,
            "posts_limit": 100,
            "ai_generations": 23,
            "ai_limit": 50
        },
        "features": {
            "ai_content": True,
            "analytics": True,
            "scheduling": True,
            "team_collaboration": False
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
