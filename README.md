# MoUmroh - Umroh Marketplace

A modern, full-stack marketplace platform for browsing and booking umroh (Islamic pilgrimage) packages.

## 🌟 Features

- **Package Browsing**: Browse diverse umroh packages with detailed information
- **Advanced Filtering**: Filter by price, duration, ratings, and search by destination
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Package Details**: View comprehensive itineraries, inclusions, and agency information
- **Modern UI**: Clean, professional interface with smooth transitions
- **Contact & Support**: Built-in contact forms and support information

## 📋 Project Structure

```
moumroh/
├── frontend/              # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── data/          # Static data
│   │   └── App.js
│   └── package.json
├── backend/               # Express.js backend API
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── package.json
├── docker-compose.yml     # Docker Compose configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose (optional)

### Local Development

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The API will run on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### Docker Setup

```bash
docker-compose up --build
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## 📦 Available Packages

The marketplace includes 7 sample packages:

1. **Premium 10-Day Umroh** - $2,499 (5★)
2. **Budget-Friendly 8-Day** - $1,299 (4★)
3. **Luxury 14-Day Journey** - $3,999 (5★)
4. **Family-Friendly 12-Day** - $2,899 (5★)
5. **Senior Citizens Special 7-Day** - $1,599 (5★)
6. **Group Discount 11-Day** - $1,899 (4★)
7. **Express 5-Day Quick Trip** - $999 (4★)

## 🔌 API Endpoints

### Packages
- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/:id` - Get single package
- `POST /api/packages/search` - Search packages
- `GET /api/health` - Health check

### Query Parameters
- `search` - Search by name or destination
- `minPrice` - Filter by minimum price
- `maxPrice` - Filter by maximum price
- `days` - Filter by duration (7-10, 10-14, 14+)
- `rating` - Filter by minimum rating (1-5)

Example:
```
GET /api/packages?search=luxury&maxPrice=4000&days=14+
```

## 🎨 Customization

### Update Package Data
Edit `/backend/data/packages.js` to add or modify packages

### Update Company Info
- Frontend: Edit components/Footer.js and pages/About.js
- Update contact details in pages/Contact.js

### Branding
- Change logo in components/Header.js
- Update colors in src/index.css
- Modify favicon in public/

## 🚢 Deployment

### Heroku
```bash
# Frontend (create app first)
git subtree push --prefix frontend heroku main

# Backend (create app first)
git subtree push --prefix backend heroku main
```

### Railway
1. Connect your GitHub repository
2. Create two services: one for frontend, one for backend
3. Set environment variables in each service
4. Deploy!

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set `REACT_APP_API_URL` environment variable
3. Deploy!

### AWS/DigitalOcean
Use the Dockerfile configurations for containerized deployment

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://username:password@host:port/moumroh
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🔐 Security Considerations

- Use environment variables for sensitive data
- Enable CORS appropriately for your domain
- Validate all user inputs on backend
- Implement rate limiting for API endpoints
- Add authentication for admin features (future)

## 📈 Next Steps

- Add user authentication and booking system
- Integrate payment processing (Stripe/PayPal)
- Add admin panel for agency management
- Implement review and rating system
- Add email notifications
- Deploy to production domain (MoUmroh.com)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM v6
- Tailwind CSS
- Lucide React Icons
- Axios

**Backend:**
- Express.js
- Node.js
- CORS
- Dotenv

**Infrastructure:**
- Docker & Docker Compose
- MongoDB (optional for production)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For questions or support regarding MoUmroh, please contact:
- Email: info@moumroh.com
- Phone: +62 (800) UMROH-1

## ✨ Next Development Phases

**Phase 2:**
- User authentication system
- Payment gateway integration
- Booking management system
- Email notifications

**Phase 3:**
- Admin dashboard
- Agency management portal
- Advanced analytics
- Email marketing integration

**Phase 4:**
- Mobile app (React Native)
- Live chat support
- Review and rating system
- Multilingual support

---

Built with ❤️ for the umroh community
