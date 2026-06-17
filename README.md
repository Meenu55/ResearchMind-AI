<div align="center">

<img src="https://img.shields.io/badge/ResearchMind-AI-6366f1?style=for-the-badge&logoColor=white" alt="ResearchMind AI" height="48"/>

# ResearchMind AI

**A Multi-Agent Research Intelligence Platform**

*Automate Literature Analysis · Build Knowledge Graphs · Detect Research Gaps · Generate Proposals*

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=flat-square&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=flat-square&logoColor=white)](https://www.trychroma.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br/>

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Installation](#-installation) · [Usage](#-usage) · [Roadmap](#-roadmap)

</div>

---

## Overview

**ResearchMind AI** is a full-stack, AI-powered research intelligence platform that automates the end-to-end academic research workflow. It combines **Multi-Agent AI**, **Knowledge Graphs**, **Vector Search**, **Literature Review Generation**, and **Proposal Drafting** into a unified, intelligent workspace.

Instead of manually searching papers, reviewing literature, identifying gaps, and drafting proposals — ResearchMind AI handles all of it through a coordinated agentic pipeline.

> Built for students, researchers, professors, and innovation-driven startups.

---

## Features

<table>
<tr>
<td width="50%">

### 🔍 Research Paper Search
Search and retrieve papers from **arXiv** with titles, abstracts, authors, and full metadata. Save papers for deeper analysis.

### 📄 PDF Analysis
Upload research papers for automatic content extraction and structured academic document parsing.

### 🧠 Semantic Search
Context-aware retrieval powered by **ChromaDB** and **vector embeddings** — find similar papers and semantically related content instantly.

### 🕸️ Knowledge Graph Construction
Entity and relationship extraction with **Neo4j** — map concepts, discover connections, and explore research topics visually.

</td>
<td width="50%">

### 📊 Research Gap Detection
Automatically surfaces unexplored research areas, existing limitations, and potential future directions from a paper corpus.

### 💡 Novel Idea Generation
Transforms detected research gaps into actionable project ideas, startup opportunities, and research directions.

### 📚 Literature Review Generation
Auto-generates structured reviews covering Introduction, Related Work, Methodologies, Trends, Limitations, Future Directions, and Conclusion.

### 📝 Research Proposal Generator
Produces complete proposals with Title, Abstract, Problem Statement, Objectives, Methodology, Architecture, Timeline, and Expected Outcomes.

</td>
</tr>
</table>

---

## Architecture

ResearchMind AI uses a **Manager-Agent orchestration pattern** where a central manager delegates tasks to specialized sub-agents, each responsible for a distinct stage of the research pipeline.

```
                          ┌─────────────┐
                          │    User     │
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │   Manager   │
                          │    Agent    │
                          └──────┬──────┘
                                 │
          ┌──────────┬───────────┼───────────┬──────────┐
          │          │           │           │          │
    ┌─────▼────┐ ┌───▼───┐ ┌────▼────┐ ┌───▼───┐ ┌────▼──────┐
    │  Search  │ │Reader │ │  Graph  │ │  Gap  │ │Innovation │
    │  Agent   │ │ Agent │ │  Agent  │ │ Agent │ │   Agent   │
    └─────┬────┘ └───┬───┘ └────┬────┘ └───┬───┘ └────┬──────┘
          │          │           │           │          │
       arXiv       PDF        Neo4j       Gemini     Gemini
        API        Data        Graph        LLM        LLM
                                 │
                    ┌────────────▼────────────┐
                    │   Literature Review     │
                    │         Agent           │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Proposal Generation    │
                    │         Agent           │
                    └─────────────────────────┘
```

### Agent Responsibilities

| Agent | Role |
|---|---|
| `Manager Agent` | Orchestrates workflow, routes tasks, aggregates results |
| `Search Agent` | Queries arXiv API, retrieves and filters papers |
| `Reader Agent` | Parses and extracts content from PDF documents |
| `Graph Agent` | Extracts entities/relationships, builds Neo4j knowledge graph |
| `Gap Agent` | Detects research gaps and underexplored areas |
| `Innovation Agent` | Generates novel ideas from detected gaps |
| `Literature Review Agent` | Synthesizes structured literature reviews |
| `Proposal Agent` | Drafts full research proposals |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, TanStack Router, Tailwind CSS, Framer Motion |
| **Visualization** | React Flow (graph), Recharts (analytics) |
| **Backend** | FastAPI, Python |
| **LLM** | Google Gemini |
| **Embeddings** | Sentence Transformers |
| **Vector DB** | ChromaDB |
| **Graph DB** | Neo4j |
| **Research Source** | arXiv API |
| **HTTP Client** | Axios |

---

## Project Structure

```
ResearchMind-AI/
│
├── agents/                         # Multi-agent system
│   ├── manager_agent.py            # Orchestrator
│   ├── search_agent.py             # arXiv search
│   ├── reader_agent.py             # PDF parsing
│   ├── graph_agent.py              # Knowledge graph
│   ├── gap_agent.py                # Gap detection
│   ├── innovation_agent.py         # Idea generation
│   ├── literature_review_agent.py  # Review synthesis
│   └── proposal_agent.py           # Proposal drafting
│
├── backend/
│   ├── routes/                     # API endpoints
│   │   ├── search.py
│   │   ├── upload.py
│   │   ├── analyze.py
│   │   ├── semantic_search.py
│   │   ├── literature_review.py
│   │   ├── proposal.py
│   │   └── analytics.py
│   │
│   ├── services/                   # Core services
│   │   ├── llm_service.py
│   │   ├── embedding_service.py
│   │   ├── vector_service.py
│   │   ├── graph_db.py
│   │   ├── entity_extractor.py
│   │   ├── relationship_extractor.py
│   │   ├── gap_detector.py
│   │   ├── idea_generator.py
│   │   └── proposal_exporter.py
│   │
│   └── main.py
│
├── frontend-react/
│   └── src/
│       ├── routes/
│       │   ├── assistant.tsx
│       │   ├── papers.tsx
│       │   ├── graph.tsx
│       │   ├── gaps.tsx
│       │   ├── ideas.tsx
│       │   ├── reviews.tsx
│       │   ├── proposals.tsx
│       │   ├── analytics.tsx
│       │   └── settings.tsx
│       ├── components/
│       ├── services/
│       └── router.tsx
│
├── uploads/
├── tests/
├── requirements.txt
└── README.md
```

---

## Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- Neo4j (local or cloud instance)
- Google Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ResearchMind-AI.git
cd ResearchMind-AI
```

---

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key

NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

---

### 3. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn backend.main:app --reload
```

API will be available at: `http://127.0.0.1:8000`  
Interactive docs: `http://127.0.0.1:8000/docs`

---

### 4. Frontend Setup

```bash
cd frontend-react

npm install
npm run dev
```

App will be available at: `http://localhost:5173`

---

## Usage

| Step | Action |
|---|---|
| **1. Search** | Enter a research topic to fetch relevant papers from arXiv |
| **2. Upload** | Upload PDF papers for deep content analysis |
| **3. Analyze** | Run the agent pipeline — graph construction, gap detection, idea generation |
| **4. Review** | Generate a structured literature review from analyzed papers |
| **5. Propose** | Auto-generate a complete research proposal ready for submission |

---

## Use Cases

<table>
<tr>
<th>👩‍🎓 Students</th>
<th>🔬 Researchers</th>
<th>👨‍🏫 Professors</th>
<th>🚀 Startups</th>
</tr>
<tr>
<td>Literature reviews, project selection, research proposals</td>
<td>Gap discovery, knowledge graph analysis, paper exploration</td>
<td>Research supervision, topic recommendations, academic planning</td>
<td>Technology scouting, innovation discovery, market research</td>
</tr>
</table>

---

## Roadmap

- [ ] Multi-paper comparative analysis
- [ ] Citation network visualization
- [ ] RAG-powered conversational research assistant
- [ ] PDF export for proposals and reviews
- [ ] Research trend forecasting
- [ ] Multi-LLM support (GPT-4, Claude, Mistral)
- [ ] Collaborative workspace
- [ ] Cloud deployment (Docker + AWS/GCP)

---


---


<div align="center">


*Research Interests: Agentic AI · Knowledge Graphs · Multi-Agent Systems · AI for Scientific Discovery*

