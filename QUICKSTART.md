# 🚀 MoUmroh Quick Start - Get Running in 5 Minutes

## Step 1: Clone/Extract Files

All project files are in the `moumroh` folder with `backend` and `frontend` subdirectories.

## Step 2: Start Backend

```bash
cd backend
npm install
npm start
```

**Expected output:**
```
MoUmroh API running on port 5000
```

✅ Backend is ready at: `http://localhost:5000/api`

## Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

**Expected output:**
```
On Your Network: http://192.168.x.x:3000
```

✅ Frontend automatically opens at: `http://localhost:3000`

## 🎉 You're Done!

Your MoUmroh marketplace is now live!

### What You Can Do:
- 📦 Browse 7 umroh packages
- 🔍 Search and filter packages
- 💰 Compare prices
- ⭐ View ratings and reviews
- 📖 Read detailed itineraries
- 📞 View contact information

## 🛠️ Customization

### Add Your Packages
Edit: `backend/data/packages.js`

### Update Company Info
Edit: `frontend/src/components/Footer.js`

### Change Colors
Edit: `frontend/src/index.css`

## 🚢 Deploy to Production

See `DEPLOYMENT.md` for:
- Railway (easiest)
- Vercel + Heroku
- Docker
- AWS / DigitalOcean

## 📱 Mobile Testing

Frontend is fully responsive! Test on mobile by:
```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
ipconfig              # Windows

# Access from phone
http://YOUR_IP:3000
```

## 📚 Full Documentation

- `README.md` - Overview and features
- `SETUP.md` - Detailed setup guide
- `DEPLOYMENT.md` - Production deployment
- `FEATURES.md` - Roadmap and future features

## ❓ Troubleshooting

**Port 3000 or 5000 already in use?**
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**npm not found?**
- Install Node.js: https://nodejs.org/

**Can't reach backend from frontend?**
- Make sure backend is running on 5000
- Check `frontend/src/data/packages.js` has fallback data

## 🎯 Next Steps

1. ✅ Get running locally (done!)
2. 🎨 Customize packages and branding
3. 🌐 Get your domain ready (MoUmroh.com)
4. 🚀 Deploy to production
5. 📊 Monitor and improve

---

**Ready to scale?** See `DEPLOYMENT.md` for production setup options!

Need help? The full `SETUP.md` has detailed instructions for every step.
