# DWPT Agentic Platform Architecture

## Overview

The DWPT Agentic Platform is a modular monolithic application that simulates an AI-driven Dynamic Wired Power Transfer ecosystem for electric vehicles.

The application consists of two major components:

- Frontend (React + TypeScript)
- Backend (FastAPI)

---

## Backend Modules

### Authentication

- User Login
- FASTag Verification

### Vehicle Management

- Vehicle Library
- Vehicle Status
- Battery State

### Highway Simulation

- Highways
- Charging Stations
- Charging Arms
- Vehicle Movement

### AI Decision Engine

- Charge Planner
- Speed Recommendation
- Fleet Coordinator

### Analytics

- Battery Health
- Charging Statistics
- Station Utilization

---

## Frontend Modules

- Login
- Dashboard
- Highway View
- Vehicle View
- Charging Stations
- Analytics

---

## Database

Main entities:

- Users
- Vehicles
- Highways
- Stations
- Charging Sessions

---

## Real-Time Communication

Frontend receives live simulation updates using WebSockets.

---

## Future Scope

- LangGraph Agents
- Predictive Maintenance
- Computer Vision Integration
- Real Hardware Integration