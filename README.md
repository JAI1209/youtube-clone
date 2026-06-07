# YouTube Clone - MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React, and Node.js.
## 🔗 Repository
[GitHub - YouTube Clone](https://github.com/JAI1209/youtube-clone)

## 📸 Demo
> [Video demo coming soon](https://drive.google.com/file/d/13lqHYu8AkpG-OrOhdmSY4H6IfQq74--z/view?usp=sharing)
## Features
- User Authentication (JWT)
- Video Upload & Management
- Like/Dislike Videos
- Comments (Add, Edit, Delete)
- Channel Management
- Search & Filter Videos
- Fully Responsive Design

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT

## Setup Instructions

### Backend
```bash
cd backend
npm install
# Add your MongoDB URI in .env
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Seed Data
```bash
cd backend
node seed/seedData.js
```

## Test Login
- Email: john@example.com
- Password: password123

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/videos
- POST /api/videos
- PUT /api/videos/:id
- DELETE /api/videos/:id
- POST /api/channels
- GET /api/channels/:id
- POST /api/comments/:videoId
- PUT /api/comments/:id
- DELETE /api/comments/:id




## Important Note - MongoDB Atlas DNS Fix

If you face `ECONNREFUSED` error while connecting to MongoDB Atlas,
add these lines at the top of `backend/server.js` before `dotenv.config()`:

```javascript
import dns from 'node:dns';
// Bypass local DNS SRV block (remove in production)
dns.setServers(['1.1.1.1', '8.8.8.8']);
```

This is needed when your ISP/network blocks MongoDB Atlas SRV DNS queries.
This fix uses Cloudflare (1.1.1.1) and Google (8.8.8.8) DNS servers.