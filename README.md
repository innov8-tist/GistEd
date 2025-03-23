# GistED
### Team Information
- **Team Name**: INNOV8
- **Track**: Education

### Team Members
| Name          | Role               | GitHub                                           | LinkedIn                                                      |
|--------------|--------------------|--------------------------------------------------|----------------------------------------------------------------|
| Naveen Ravi  | Frontend/Backend   | [@Naveenravi07](https://github.com/Naveenravi07) | [Profile](https://www.linkedin.com/in/naveen-ravi-97b158229/) |
| Manu Madhu   | AI/ML              | [@Manumanu1234](https://github.com/Manumanu1234) | [Profile](https://www.linkedin.com/in/manu-madhu-086506281/)  |
| Sirin Simon  | UI/UX Design       | [@Sirinsimon](https://github.com/Sirinsimon)     | [Profile](https://www.linkedin.com/in/sirin-simon-813291293/) |
| Suraj P A    | Frontend/Python    | [@SurajPa05](https://github.com/SurajPa05)       | [Profile](https://www.linkedin.com/in/suraj-p-a-115144302/)   |

## Project Details

### Overview
GistEd is an AI-powered learning platform that centralizes study materials like PDFs, videos, and notes while offering personalized AI assistance. It features a community-driven library, task management, a doodle board, and image-to-text conversion for seamless learning. With AI-driven summaries and smart organization, GistEd makes studying faster, more collaborative, and efficient.
### Problem Statement
In today’s digital age, students and lifelong learners are overwhelmed by the sheer volume of study materials—PDFs, YouTube videos, handwritten notes, and more. This leads to disorganization, inefficiency, and frustration, often causing learners to give up. Existing tools are fragmented, lack personalization, and fail to provide a unified solution for managing, organizing, and interacting with educational content
### Solution
GistEd addresses these challenges by offering an all-in-one AI-powered platform that centralizes learning tools, enhances interactivity, and simplifies the learning process, making education smarter, faster, and more collaborative.
### Demo
[![Project Demo](https://img.youtube.com/vi/pLO7GISv2WI/0.jpg)](https://www.youtube.com/watch?v=pLO7GISv2WI)


## Technical Implementation

### Technologies Used
- **Frontend**: Vite.js
- **Backend**: Node.js, Python
- **Database**: PostgreSQL,faiss
- **APIs**: Gemini, Groq,openrouter,together 
- **DevOps**: docker

### Key Features
- AI chatbot with memory and RAG for personalized learning.  
- Extract and summarize YouTube content effortlessly.  
- Community-driven library for sharing study resources.  
- Task management with calendar integration.  
- Interactive doodle board for brainstorming.  
- Convert handwritten notes to digital text.


## Setup Instructions

### Prerequisites
- Node.js
- Python
- PostgreSQL

## Installation and Running the Project

### 1. Clone the Repository
```
git clone https://github.com/innov8-tist/GistEd.git
cd GistEd
```

### 2. Install dependencies 
```
npm install
cd apps/python
pip install -r requirements.txt
```


### 3. Run the application
```
npm run dev
```


### Challenges Faced
1. Email Automation (for Building the Lang Graph)
2. Agentic AI (Building Custom Tools)
3. Hybrid RAG Implementation
4. Semantic and Vector Search

### Future Enhancements
1. Migrating to Cloud Providers for File Management
2. Implementing reinforcement learning
