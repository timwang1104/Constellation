# Constellation

A modern, full-stack Kanban and Project Talent Tree application built with Next.js and NestJS.

## 🚀 Features

- **Kanban Board**: Visualize and manage tasks with a drag-and-drop interface.
- **Dependency Graph (Project Talent Tree)**: A visual representation of task dependencies, allowing you to manage complex project workflows.
  - **Interactive Graph**: Zoom, pan, and explore task relationships.
  - **CRUD Operations**: Create, Read, Update, and Delete tasks directly from the graph view.
  - **Dependency Management**: Visually connect tasks to establish dependencies.
- **Microservices Architecture**: Monorepo structure separating frontend, backend, and shared libraries.

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Visualization**: [React Flow](https://reactflow.dev/) for dependency graphs
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (`apps/api`)
- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript

### Infrastructure (`infra`)
- **Database**: PostgreSQL (via Docker)
- **Cache**: Redis (via Docker)
- **Containerization**: Docker Compose

## 📂 Project Structure

```
prj_kanban/
├── apps/
│   ├── web/          # Next.js Frontend application
│   └── api/          # NestJS Backend application
├── packages/
│   └── shared/       # Shared TypeScript types and utilities
├── infra/            # Infrastructure configuration (Docker Compose)
├── docs/             # Documentation (Architecture, PRD, Design)
└── package.json      # Root configuration (npm workspaces)
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for local DB)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd constellation
   ```

2. Install dependencies (from the root directory):
   ```bash
   npm install
   ```

### Running the Infrastructure

Start the PostgreSQL and Redis containers:

```bash
cd infra
docker compose up -d
```

### Running the Applications

You can start the entire stack (Infrastructure + Frontend + Backend) with a single command:

```bash
npm start
```

This command will:
1. Start PostgreSQL and Redis containers (via `docker compose`).
2. Concurrently start the Web and API applications.

Alternatively, you can run them separately:

**Start Infrastructure only:**
```bash
npm run infra:up
```

**Start Applications only (if infrastructure is already running):**
```bash
npm run dev
```

The web application will be available at [http://localhost:3000](http://localhost:3000).
The API will be available at [http://localhost:3001](http://localhost:3001).

## 📖 Documentation

Detailed documentation can be found in the `docs/` directory:
- [Architecture Overview](docs/Architecture/ARCH_constellation.md)
- [UI Design](docs/Design/UI_Design_constellation.md)
- [Product Requirements](docs/PRD/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
