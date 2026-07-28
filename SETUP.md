# MoUmroh Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** v16+ ([download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([download](https://git-scm.com/))
- **Docker** & **Docker Compose** (optional, for containerized setup)

## 🚀 Quick Start (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on: **http://localhost:5000**

Test with: `curl http://localhost:5000/api/health`

### 2. Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

Your browser will automatically open the app.

## 🐳 Docker Setup (Alternative)

Run both services with one command:

```bash
docker-compose up --build
```

Then access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
moumroh/
├── backend/
│   ├── routes/
│   │   └── packages.js          # Package API endpoints
│   ├── data/
│   │   └── packages.js          # Sample package data
│   ├── server.js                # Express app setup
│   ├── package.json
│   ├── .env                     # Environment config
│   └── Dockerfile               # Docker configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── PackageCard.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js
│   │   │   ├── Packages.js
│   │   │   ├── PackageDetail.js
│   │   │   ├── About.js
│   │   │   └── Contact.js
│   │   ├── data/
│   │   │   └── packages.js      # Sample data
│   │   ├── App.js               # Main component
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── .gitignore
│
├── docker-compose.yml           # Docker Compose setup
├── README.md                    # Main documentation
├── DEPLOYMENT.md                # Deployment guide
├── FEATURES.md                  # Features & roadmap
└── SETUP.md                     # This file
```

## 🔧 Configuration

### Backend Environment (.env)

```bash
# Copy from example
cp .env.example .env

# Edit .env
nano backend/.env
```

Key variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/moumroh
```

### Frontend Environment (.env)

Create `.env` in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://api.moumroh.com/api
```

## 🧪 Testing the API

### Get All Packages
```bash
curl http://localhost:5000/api/packages
```

### Search Packages
```bash
curl "http://localhost:5000/api/packages?search=luxury"
```

### Filter by Price
```bash
curl "http://localhost:5000/api/packages?maxPrice=2000"
```

### Get Single Package
```bash
curl http://localhost:5000/api/packages/1
```

## 📝 Key Files to Customize

### 1. Update Company Info
- **Frontend Header**: `frontend/src/components/Header.js`
- **Footer Contact**: `frontend/src/components/Footer.js`
- **About Page**: `frontend/src/pages/About.js`
- **Contact Page**: `frontend/src/pages/Contact.js`

### 2. Add/Modify Packages
Edit `backend/data/packages.js`:
```javascript
{
  id: 8,
  name: "Your Package Name",
  destination: "Destination",
  description: "Package description",
  price: 1999,
  days: 10,
  rating: 5,
  reviews: 0,
  image: "image_url",
  maxParticipants: 15,
  departure: "Date",
  agency: "Agency Name",
  itinerary: [...],
  inclusions: [...]
}
```

### 3. Customize Colors
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #1e40af;  /* Change blue to your brand color */
  --accent: #f59e0b;
  /* ... other colors ... */
}
```

Or update Tailwind theme in `tailwind.config.js`.

## 🚢 Deployment

### Quick Deployment with Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect your repo
4. Add backend and frontend services
5. Set environment variables
6. Deploy!

See `DEPLOYMENT.md` for more options.

## 🐛 Troubleshooting

### Issue: "npm: command not found"
- Install Node.js from https://nodejs.org/
- Verify: `node --version` and `npm --version`

### Issue: Port already in use
```bash
# Change port in .env or kill process
lsof -i :5000
kill -9 <PID>
```

### Issue: Frontend can't reach backend
- Check backend is running on 5000
- Verify `REACT_APP_API_URL` in frontend .env
- Check CORS settings in backend

### Issue: "Permission denied" on Docker
```bash
sudo usermod -aG docker $USER
# Log out and log back in
```

## 📚 Useful Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Run development server
npm start

# Run with auto-reload (requires nodemon)
npm run dev

# Stop server
Ctrl+C
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Test production build locally
npm run build
npx serve -s build
```

### Docker
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose up --build
```

## 🎯 Next Steps

1. **Test locally** - Ensure everything runs on localhost
2. **Customize content** - Update packages, company info
3. **Connect domain** - Point MoUmroh.com to your host
4. **Deploy** - Follow deployment guide
5. **Monitor** - Set up logging and monitoring
6. **Iterate** - Add features from roadmap

## 📞 Support

Issues or questions?
- Check documentation in `README.md`
- Review deployment guide in `DEPLOYMENT.md`
- Check features roadmap in `FEATURES.md`

## ✨ What's Included

✅ **Frontend**
- React 18 with routing
- Responsive Tailwind CSS design
- 7 real sample packages
- Filtering and search
- Package details with itineraries

✅ **Backend**
- Express.js REST API
- Package endpoints
- Search and filter logic
- CORS enabled
- Health check endpoint

✅ **Documentation**
- Setup guide (this file)
- Deployment guide
- Features roadmap
- README with features

✅ **Infrastructure**
- Docker Compose config
- Dockerfiles for both services
- Environment configuration
- Production-ready structure

---

You're all set! 🎉

Start with `npm install && npm start` in both directories and visit http://localhost:3000
