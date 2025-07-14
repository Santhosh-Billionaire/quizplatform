

# 🧠 QuizPlatform — AI-Powered Book-to-Quiz Generator

![QuizPlatform Banner](https://img.shields.io/badge/AI%20Quiz%20App-Powered%20by%20Gemini-blueviolet)

**QuizPlatform** is an AI-powered web app that transforms uploaded **PDF books** into interactive quizzes in seconds. Built with **React**, **Node.js**, **Supabase**, and **Gemini Pro**, this platform is ideal for learners, educators, and edtech startups to test comprehension instantly.

---

## 📸 Demo Screens

### 📥 Upload Book

![Upload Book]<img width="935" height="923" alt="image" src="https://github.com/user-attachments/assets/f05c538a-e16a-4722-82a5-537a07a328db" />


### ⚙️ Quiz Setup

![Quiz Setup]<img width="935" height="571" alt="image" src="https://github.com/user-attachments/assets/74e71633-6890-4a4c-a07b-51ce30d7f1d2" />


### 🔢 Difficulty & Time Settings

![Difficulty Selection]<img width="936" height="911" alt="image" src="https://github.com/user-attachments/assets/7b31b24a-abab-4643-ac02-8f7e03fb5610" />


### 🧪 Live Quiz

![Question UI]<img width="1040" height="761" alt="Screenshot 2025-07-14 101627" src="https://github.com/user-attachments/assets/14b1c2e0-c680-4335-9664-9501c50ca8bf" />

### 📊 Quiz Results

![Result UI] <img width="1208" height="905" alt="Screenshot 2025-07-14 103044" src="https://github.com/user-attachments/assets/2793e916-abd5-4e42-81e9-27c09174c512" />


---

## 🚀 Features

* 📚 Upload PDFs and extract content

* 🤖 Gemini Pro AI generates MCQs from context
* 🧠 Topic-wise grouping & difficulty control
* ⚙️ Quiz setup: topic, time, difficulty
* 📊 Real-time score tracking
* 📥 PDF report generation
* 📈 Dashboard with performance metrics
* 🔌 API-based design (easy plugin embedding)

---

## 🧑‍💻 Tech Stack

| Layer     | Technology                             |
| --------- | -------------------------------------- |
| Frontend  | React, Tailwind CSS, Axios             |
| Backend   | Node.js, Express.js, Multer, PDF-Parse |
| AI Layer  | Gemini 1.5 Flash API                   |
| Database  | Supabase (PostgreSQL + Storage)        |
| Uploads   | Multer + Supabase Storage              |
| Reporting | PDFKit                                 |

---

## 📁 Folder Structure

```
quiz/
├── backend/
│   ├── src/                # Express backend
│   └── .env                # Supabase + Gemini keys
├── frontend/
│   ├── src/                # React App
│   ├── public/screenshots  # UI image references
│   └── App.js
├── database/               # SQL schema
├── README.md
```

---

## 🧠 Database Design (Supabase PostgreSQL)

### `books`

| Field     | Type | Description              |
| --------- | ---- | ------------------------ |
| id        | UUID | Primary key              |
| title     | TEXT | Book title               |
| file\_url | TEXT | Supabase file URL        |
| raw\_text | TEXT | Extracted text from book |

### `questions`

| Field      | Type  | Description              |
| ---------- | ----- | ------------------------ |
| id         | UUID  | Primary key              |
| book\_id   | UUID  | FK → `books.id`          |
| question   | TEXT  | Question                 |
| options    | JSONB | 4-option array           |
| answer     | TEXT  | Correct answer           |
| topic\_id  | UUID  | FK → `topics.id`         |
| difficulty | TEXT  | `easy`, `medium`, `hard` |

---

## 🔄 User Flow

1. 📥 **Upload PDF Book**
2. 📄 **Extract Text (pdf-parse)**
3. 🤖 **Generate Questions (Gemini API)**
4. 🧩 **Categorize by Topic & Difficulty**
5. ⚙️ **Quiz Setup UI (User selects options)**
6. 🧪 **User Takes Quiz**
7. 📊 **Score Calculated & Stored**
8. 📤 **PDF/Result Dashboard Shown**

---

## 🧩 Plugin or Integration Use Case

**QuizPlatform** is API-first and can be embedded or used as:

* 🔌 React/Vue plugin via iframe
* 🎓 LMS extension (Teachable, Moodle, Canvas)
* 📘 School portals
* 📚 Edtech dashboards

**Integration Steps:**

* Use backend endpoints:

  * `/api/upload`
  * `/api/generate-questions`
  * `/api/quiz/start`
* Embed UI via iframe or use REST API

---

## 💰 Monetization & Market Scope

| Plan       | Price   | Description                       |
| ---------- | ------- | --------------------------------- |
| Free       | ₹0/mo   | 2 books, limited quizzes          |
| Pro        | ₹299/mo | 10 books, quiz reports, analytics |
| Enterprise | ₹999/mo | Unlimited, team access, API keys  |

* 🔥 **Target**: Schools, Coaching, Publishers, Edtech Startups
* 💡 **AI Cost**: \~₹0.002/question via Gemini 1.5 Flash
* 💸 **Infra Cost**: Supabase Free Tier + Vercel Netlify (Free)

---

## ⚙️ Deployment

### 🔹 Frontend (React) on Vercel

```bash
cd frontend
npm install
npm run build
# Connect to Vercel and deploy the `build/` folder
```

### 🔸 Backend (Express) on Railway

```bash
cd backend
npm install
# Add .env with:
# SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, PORT
node server.js
```

---

## 🔐 Environment Variables

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
PORT=5000
```

---

## 💡 Future Ideas

* Supabase Auth Integration
* Multilingual Quiz Support
* Bookmark Difficult Questions
* AI Explanation Generator
* Admin Dashboard for Educators
* Export to Google Classroom

---

## 👨‍💻 Author & Maintainer

Built by [Santhosh-Billionaire](https://github.com/Santhosh-Billionaire)
For collabs, issues or PRs — welcome 🙌

---

## 📜 License

Licensed under **MIT** — use it freely, with ❤️

> “Turn your content into learning. Smarter, faster, AI-driven.”

---
