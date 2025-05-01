# EduAgent.ai - Frontend (React)

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Axios](https://img.shields.io/badge/axios-^1.0.0-purple)](https://axios-http.com/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?logo=react-router)](https://reactrouter.com/)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This repository contains the React.js frontend code for **EduAgent.ai**, an AI-powered tutoring platform.

> **Backend Repo:** [Link to the EduAgent.ai Backend GitHub repository]

---

## 🚀 Overview

EduAgent.ai is a multi-source AI tutor platform. The frontend allows users to:

- Sign up / Log in
- Choose a subject
- Upload PDFs to build a knowledge base
- Chat with an AI tutor using subject-specific context
- View multi-source responses (RAG from PDFs, LLMs, Web Search)
- Switch between light and dark mode

This React app interacts with a Django/DRF backend for authentication and AI responses.

---

## ✨ Features

- **Authentication:** Secure login/signup with protected routes.
- **Subject Selection:** Dropdown to select subject context.
- **PDF Upload:** Upload PDFs to generate a Knowledge Base.
- **Chat Management:** Create, select, and delete chat sessions.
- **Chat UI:**
  - Markdown-based AI responses
  - Code highlighting
  - Input with Enter to send / Shift+Enter for newline
- **Multi-Source Tabs:** View answer components via tabs - `FINAL`, `RAG`, `LLM`, `WEB`, `SOURCES`.
- **State Management:** React Context API + `useReducer`
- **Theming:** Light/Dark mode with CSS variables and `localStorage`
- **API Integration:** Axios with interceptors and JWT token handling

---

## 🧱 Tech Stack

- **React 18+**
- **React Router v6**
- **Axios**
- **React Context + useReducer**
- **react-markdown**
- **react-syntax-highlighter**
- **CSS Variables**

---

## 📁 Project Structure

src/
├── components/ # UI Components organized by feature/area
│ ├── Auth/ # Login, Signup, ProtectedRoute
│ ├── Sidebar/ # Sidebar and its contents
│ ├── ChatWindow/ # Chat area and its contents
│ └── common/ # Reusable components (Spinner, ErrorDisplay)
├── context/ # React Context, Reducer, Initial State
├── hooks/ # Custom hooks (e.g., useScrollToBottom)
├── services/ # API interaction layer (api.js using axios)
├── App.css # Global styles and CSS Variables
├── App.js # Main application component with routing setup
└── index.js # Entry point


---

## 🛠️ Getting Started

### Prerequisites

- Node.js v16+ and npm or yarn
- A running instance of the [EduAgent.ai Backend](link-to-your-backend-repo)

### Installation

```bash
git clone <repository-url>
cd eduagent-frontend
npm install   # or yarn install
