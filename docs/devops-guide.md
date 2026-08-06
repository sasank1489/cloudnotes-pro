# CloudNotes Pro DevOps & Deployment Guide

This document outlines how CloudNotes Pro is prepared for production deployment with Docker, Kubernetes, AWS, GitHub Actions, Prometheus, Grafana, and Loki.

## 1. Containerization (Docker)
Both `/backend` and `/frontend` include optimized Dockerfiles:
- **Backend**: Multi-stage Node.js container compiling TypeScript to clean JavaScript artifacts (`dist/`).
- **Frontend**: Multi-stage build building Vite static files and serving them via high-performance Nginx.

## 2. Telemetry & Metrics (Prometheus & Grafana)
The backend service exposes Prometheus metrics at `/metrics` using `prom-client`.
Default metrics collected:
- HTTP request duration histograms (`http_request_duration_seconds`)
- Total HTTP requests counter (`http_requests_total`) by route, status code, and method
- Node.js event loop & memory statistics

## 3. Log Aggregation (Morgan & Loki)
- The Express application outputs JSON-formatted HTTP request logs through `morgan`.
- stdout logs are captured seamlessly by Loki drivers (e.g. Grafana Promtail or AWS CloudWatch Container Insights).

## 4. Kubernetes & Helm Deployment Readiness
- Environment configuration is driven completely by standard `.env` / Environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`).
- Liveness & Readiness probes map directly to `/health`.
