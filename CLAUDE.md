# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Constellation is a full-stack Kanban and Project Talent Tree application for managing tasks with dependency graphs. It supports both human and AI Agent task assignment and execution.

## Development Commands

```bash
# Install dependencies (from root)
npm install

# Start infrastructure (PostgreSQL + Redis via Docker)
npm run infra:up

# Stop infrastructure
npm run infra:down

# Start both web and api in development
npm run dev

# Start web only
npm run dev:web

# Start api only
npm run dev:api

# Start everything (infra + apps)
npm start
```

### Ports
- Web (Next.js): http://localhost:3000
- API (NestJS): http://localhost:3001
- PostgreSQL: localhost:5432 (user/password/db: constellation)
- Redis: localhost:6379

## Architecture

This is a **npm workspaces monorepo** with the following structure:

```
apps/
  web/     # Next.js 14 frontend (App Router, React Flow, Tailwind)
  api/     # NestJS backend (minimal setup currently)
packages/
  shared/  # Shared types (currently re-exports from web/types)
docs/
  Architecture/  # System architecture (event-sourcing, agent workflows)
  PRD/           # Product requirements
  Design/        # UI design docs
infra/
  docker-compose.yml  # PostgreSQL 16 + Redis 7
```

### Frontend (`apps/web`)

- **App Router** with pages: `/` (kanban), `/graph` (dependency graph)
- **State Management**: React Context (`TaskContext`) with localStorage persistence and undo history
- **Visualization**: React Flow for dependency graphs with dagre auto-layout
- **Styling**: Tailwind CSS with custom color palette (concrete, ink, status colors)
- **Key Types**: `Task`, `Dependency`, `Epic`, `Project` in `src/types/kanban.ts`

### Backend (`apps/api`)

- Minimal NestJS setup with health endpoint
- Planned: Task/Dependency/Claim services with event-sourcing pattern

### Data Model

Core entities follow event-sourcing architecture:
- **Task**: id, epicId, title, status, priority, assignee, dependencies
- **Dependency**: source/target task IDs (DAG edges)
- **Epic**: Groups tasks within a project
- **Project**: Top-level container

Task status flow: `todo` → `inprogress` → `done` (or `blocked`/`canceled`)

Assignee types: `human` | `agent` | `none`

## Key Patterns

- **Undo Support**: Context stores snapshots for undo operations (`MAX_HISTORY_SIZE = 50`)
- **Auto-save**: Changes persist to localStorage automatically
- **Cascade Delete**: Deleting tasks removes their dependencies
- **Quick Extend**: Graph nodes can spawn connected tasks in 4 directions