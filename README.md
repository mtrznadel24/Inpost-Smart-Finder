# InPost Smart Finder

An interactive, high-performance web application designed to help users quickly find the best parcel locker for their specific needs, view its details, and navigate to it easily.

**Live Demo:** https://smart-finder.mtrznadel.me/

---

## Problem Definition & Approach

When presented with the open-ended task of utilizing the InPost API, I decided to focus on the "Smart finder" direction. 

The task was intentionally vague, so I narrowed it down to a concrete problem: The official API provides access to tens of thousands of parcel lockers. Fetching and rendering this volume of data directly on a client device is highly inefficient. My goal was to create a tool that gives users a clear, instant view of lockers in their area, allows them to apply strict hardware/accessibility filters, and lets them navigate to the chosen locker via Google or Apple Maps.

To achieve this without hitting the InPost API on every user request (and to ensure lightning-fast UI performance), I decoupled the client application from the external InPost API by introducing my own spatial database and a background synchronization mechanism.

## Technical Decisions & Architecture

I made deliberate choices regarding the stack to ensure the code is clean, readable, and production-ready.

### Database & Data Flow (PostgreSQL + PostGIS)
Instead of calculating distances in application memory or querying the InPost API directly, I offloaded all spatial operations to PostGIS. This allows the application to perform highly optimized bounding-box (`in-scope`) queries, fetching only the lockers currently visible on the user's screen. 
To offload the official InPost API, my application fetches the data only at startup and synchronizes it in the background every hour. 

### Backend (FastAPI + Python)
I chose FastAPI for its modern, asynchronous capabilities. Since the database handles the heavy lifting of spatial queries, Python is not a bottleneck here. 
* **Data Quality:** I heavily relied on Pydantic to validate data coming from the external API, ensuring data integrity.
* **Background Processing:** To prevent the data synchronization process from blocking the main thread, I implemented a background worker (ARQ) coordinated with Redis. 
* **Architecture:** I aimed for high code readability. The core logic, configurations, and database settings are decoupled. I structured the application using Domain-Driven Design (DDD) principles (e.g., the `lockers` package serves as an independent domain), meaning this module could easily be extracted into a separate microservice if needed.

### Frontend (React + Vite + Tailwind CSS)
I chose Vite over frameworks like Next.js to avoid Server-Side Rendering (SSR) complications that often occur with map libraries, keeping the frontend light and fast.
* **Map Engine:** I used React-Leaflet. While MapBox was an option, Leaflet provides a lightweight, modern-looking map without requiring external API keys. 
* **Performance Limits:** I implemented map marker clustering and strictly limited the API response to 500 points at once. Rendering more points simultaneously degrades performance, and realistically, no user needs to evaluate more than 500 lockers in a single view.
* **State Management & UI:** I used React Query alongside Axios for efficient data fetching and error handling. For the UI, I utilized shadcn/ui to maintain a clean, modern aesthetic without wasting time reinventing standard components.
* **Features:** The app integrates native browser Geolocation, address searching via the free Nominatim API, and seamless navigation to external map providers.
* **Internationalization:** The app supports both English and Polish via `i18next`. Since InPost is a Polish company and the vast majority of the lockers are in Poland, I set Polish as the default language.

### Infrastructure & Deployment
The entire application is containerized using Docker. I used Nginx as a reverse proxy, which not only prepares the app for deployment but also eliminates CORS issues by serving the frontend and backend under the same origin. 

The application is currently deployed on a DigitalOcean Droplet, secured with Cloudflare (HTTPS), and is ready to run locally with just a few commands.

---

## Local Setup & Run Instructions

The repository includes everything needed to build and run the application locally.

### Prerequisites
* Docker
* Docker Compose

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/mtrznadel24/Inpost-Smart-Finder
cd Inpost-Smart-Finder
```
2. Set up environment variables by copying the provided example file:
```bash
cp .env.example .env
```
3. Start the application:
```bash
docker compose up -d --build
``` 
4. Access the application:

Frontend: [http://localhost](http://localhost)

Backend API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

Note: Upon the first startup, the background worker will immediately begin fetching data from the InPost API. It takes a few moments to populate the database with all national lockers.

### Testing & CI
To ensure the reliability of the core backend logic, the application is fully tested with Pytest, covering the main code paths and endpoints.
Additionally, I set up a GitHub Actions CI pipeline that automatically runs the test suite and a linter on every Pull Request and merge to the main branch.

To run the tests locally (while containers are running):
```bash
docker compose exec backend pytest
```

### What I Left Out (Trade-offs)
To keep the scope manageable and focused on a high-quality core experience, I deliberately left out:

Automated CD Pipeline: While I implemented CI for testing, the actual deployment to the DigitalOcean server is done via manual Docker commands to focus more time on application architecture.

User Accounts: Features like saving favorite lockers were omitted to keep the tool frictionless and immediate.

### Author
[Maciej Trznadel](https://github.com/mtrznadel24)