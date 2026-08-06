# CloudNotes Pro 🚀

CloudNotes Pro is an enterprise-grade, cloud-native note management platform built with modern web technologies and engineered with DevOps practices in mind. It supports secure creation, organization, searching, archiving, pinning, and sharing of notes with role-based access control and system monitoring telemetry.

---

## 🌟 Key Features

- **Release 1: Core Note Management & Security**
  - JWT-based authentication with bcrypt password hashing
  - Role-Based Access Control (User & Admin roles)
  - Full CRUD operations for personal notes
  - High-impact glassmorphic user interface with dark/light mode

- **Release 2: Advanced Organization & Search**
  - Category assignment and multi-tag system
  - Full-text instant search with debounced inputs
  - Pinning notes to top priority view
  - Archiving completed/inactive notes
  - Multi-attribute filtering (category, tag, pin status, archive status) and sorting

- **Release 3: Collaboration & Enterprise Management**
  - Secure note sharing with other registered platform users
  - User profile management & avatar customizing
  - Admin dashboard with real-time system metrics, note count telemetry, and user management controls

- **DevOps & Cloud Production Architecture**
  - Containerized with Docker and multi-stage builds
  - Orchestrated with Docker Compose
  - Built-in Prometheus `/metrics` telemetry endpoint
  - Structured HTTP logging (Morgan/Winston format) for Loki log aggregation
  - Production-ready health check endpoint (`/health`)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **Routing**: React Router v6
- **State & Data Fetching**: TanStack Query (React Query v5) & Context API
- **Forms & Validation**: React Hook Form + Zod validation
- **HTTP Client**: Axios with automated bearer token interceptors

### Backend
- **Runtime & Framework**: Node.js & Express.js with TypeScript (MVC Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Rate Limiting, Cookie Parser, Compression
- **Monitoring**: `prom-client` (Prometheus telemetry)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas connection string)
- Docker & Docker Compose (optional for containerized run)

### Running with Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/your-org/cloudnotes-pro.git
cd cloudnotes-pro

# Launch all services (Frontend, Backend, MongoDB)
docker-compose up --build -d
```
- Frontend Web App: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- API Health Check: `http://localhost:5000/health`
- Prometheus Telemetry: `http://localhost:5000/metrics`

---

## 📁 Repository Structure

```
cloudnotes-pro/
├── docker-compose.yml
├── README.md
├── LICENSE
├── docs/
│   ├── api-docs.md
│   └── devops-guide.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
```

---

## 📜 License

MIT License - see [LICENSE](file:///c:/projects/cloudnotes-pro/LICENSE) for details.
