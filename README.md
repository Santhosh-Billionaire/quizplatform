```markdown
# 🧠 QuizPlatform — AI-Powered Book-to-Quiz Generator

![QuizPlatform Banner](https://img.shields.io/badge/AI%20Quiz%20App-Powered%20by%20Gemini-blueviolet)

QuizPlatform is an AI-driven web application that converts **uploaded books or study material** into interactive quizzes with real-time scoring, topic tagging, and difficulty management. Built using **React**, **Node.js**, and **Supabase**, this project is ideal for learners, educators, and edtech startups.

---

## 🚀 Features

- 📚 **Upload PDF Books**
- 🤖 **AI-Generated MCQs** from Book Content (via Gemini/OpenAI)
- 🧩 **Topic-Wise Question Grouping**
- ⚙️ **Difficulty Selection** (`easy`, `medium`, `hard`)
- 📊 **Real-Time Scoring & Performance Dashboard**
- 📥 **PDF Report Generation**
- 🌐 **API-Ready Design** (for plugin/extension integration)
- 🧠 **Adaptive Quizzing Logic (Coming Soon)**

---

## 🧑‍💻 Tech Stack

| Layer       | Tech                          |
| ----------- | ----------------------------- |
| Frontend    | React, Axios, React Router    |
| Backend     | Node.js, Express, Multer, PDF-Parse |
| Database    | Supabase (PostgreSQL + Storage) |
| AI Layer    | Gemini 1.5 Pro (via REST API) |
| Styling     | CSS Modules / Tailwind (optional) |
| File Upload | Multer + Supabase Storage     |
| Reporting   | PDFKit                        |

---

## 📂 Folder Structure

```

quiz/
├── backend/          # Express + Supabase + AI logic
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   └── server.js
├── frontend/         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   ├── .env
│   └── App.js
├── database/         # SQL schema snapshots
├── .gitignore
└── README.md

````

---

## 🧱 Database Schema (PostgreSQL via Supabase)

### `books`
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | uuid    | Primary Key               |
| title      | text    | Book Title                |
| file_url   | text    | Supabase file storage URL |
| raw_text   | text    | Extracted book content    |
| created_at | timestamp | Upload time             |

### `questions`
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | uuid    | Primary Key               |
| book_id    | uuid    | Foreign Key to books      |
| question   | text    | MCQ                       |
| options    | jsonb   | JSON of 4 options         |
| answer     | text    | Correct answer key        |
| topic_id   | uuid    | Foreign key to topic      |
| difficulty | text    | `easy` / `medium` / `hard`|

### `quizzes`, `responses`, `topics`
Check the [Schema Docs](./database/) for full specs.

---

## 🔄 User Flow

1. **User uploads a book (PDF)**
2. **Backend parses PDF using `pdf-parse`**
3. **Gemini API generates questions with answers**
4. **Questions are categorized by topic & difficulty**
5. **User selects topics/difficulty to start a quiz**
6. **Frontend renders MCQs; answers are submitted**
7. **Backend scores and stores responses**
8. **Performance shown via dashboard & PDF reports**

---

## 🧩 Plugin/Extension Use Case

QuizPlatform is built with a **modular API-first design**, enabling it to be embedded or integrated into:

- 📘 E-learning platforms (Moodle, Teachable, Canvas)
- 🏫 School/College portals
- 🧠 LMS dashboards or CMS systems
- 🌐 Any React/Vue website (via plugin or iframe API)

To integrate:
- Use the `/upload`, `/quiz`, `/generate` endpoints
- Provide book file + auth token (optional)
- Use REST or embed as iframe frontend

---

## 📈 Market Potential & Monetization

- **Target Users**: Schools, Coaching Centers, Edtech Apps, Universities
- **Pricing Model**:
  - Free Tier: 2 books/month
  - Pro Tier: ₹299/month (10 books, analytics)
  - Enterprise Tier: ₹999/month (unlimited + team)
- **AI Token Cost**: ₹0.002/question via Gemini API (~₹0.80 per quiz)
- **Hosting Cost**: Free on Vercel/Netlify (Frontend), Supabase free tier covers 500MB DB + 2GB Storage

---

## 🚀 Deployment Instructions

### 🔹 Frontend (React) on Vercel/Netlify
```bash
cd frontend
npm install
npm run build
# Connect to Vercel/Netlify and deploy the build folder
````

### 🔸 Backend (Express) on Railway/Render

```bash
cd backend
npm install
# Add .env (with Supabase + Gemini keys)
node server.js
```

---

## 🌍 Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

---

## 💡 Ideas for Improvement

* Add user auth (Supabase/Auth0)
* Explanation for each question
* Auto-assign topic based on AI categorization
* Leaderboards / Gamification
* Mobile App (React Native)
* Multilingual Support

---

## 🧠 Author & Contributions

**Developed by [Santhosh-Billionaire](https://github.com/Santhosh-Billionaire)**
For contributions, feature requests, or collaborations — feel free to open issues or PRs.

---

## 📜 License

This project is open-sourced under the **MIT License**.

---

> **Empower learning with AI. Build smarter quizzes from the content you love.**

```

---

Would you like a PDF version of this `README` too? I can convert it for distribution or presentations.
```
