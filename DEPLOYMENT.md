# MoUmroh Deployment Guide

## 🌐 Hosting Your MoUmroh Marketplace

This guide covers deployment options for MoUmroh.com

## Option 1: Railway (Recommended - Easy)

Railway provides easy deployment with automatic CI/CD.

### Steps:
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Connect GitHub repo
4. Add two services: Backend and Frontend

**Backend Service:**
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moumroh
  ```

**Frontend Service:**
- Build Command: `npm install && npm run build`
- Start Command: `serve -s build`
- Environment Variables:
  ```
  REACT_APP_API_URL=https://your-backend-railway-url/api
  ```

## Option 2: Vercel + Heroku

**Frontend on Vercel:**
1. Connect GitHub to Vercel
2. Set `REACT_APP_API_URL` in project settings
3. Deploy

**Backend on Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create moumroh-api

# Push backend
cd backend
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
```

## Option 3: Docker on DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Select GitHub repository
4. Use provided `docker-compose.yml`
5. Configure environment variables
6. Deploy!

## Option 4: AWS (Advanced)

### Using ECS:
1. Create ECR repositories for frontend and backend
2. Build and push Docker images:
   ```bash
   # Backend
   docker build -t moumroh-backend ./backend
   docker tag moumroh-backend:latest YOUR_ECR_URI:latest
   docker push YOUR_ECR_URI:latest
   ```
3. Create ECS services for each
4. Set up RDS for MongoDB alternatives (DynamoDB/DocumentDB)
5. Use ALB for load balancing

### Using Elastic Beanstalk:
```bash
eb init -p "Node.js 18 running on 64bit Amazon Linux 2"
eb create moumroh-env
eb deploy
```

## Database Setup

### MongoDB Atlas (Recommended):
1. Create account at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create cluster
3. Get connection string
4. Add to environment variable:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moumroh
   ```

### Self-Hosted MongoDB:
```bash
docker run -d -p 27017:27017 -v mongo_data:/data/db mongo
```

## Domain Setup

### Connect MoUmroh.com:

1. **DNS Records:**
   - Point A record to your host's IP
   - Or use CNAME record for platform-specific domains

2. **SSL Certificate:**
   - Most platforms provide free SSL
   - Verify it's enabled in platform settings

3. **Environment Variables:**
   Update your frontend's API URL:
   ```
   REACT_APP_API_URL=https://api.moumroh.com/api
   ```

## Performance Optimization

### Frontend:
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Minimize bundle size

### Backend:
- Enable caching headers
- Use connection pooling
- Implement rate limiting
- Add request logging

## Monitoring & Logging

### Railway:
- Built-in logs in dashboard
- Environment monitoring
- Error tracking

### Custom Monitoring:
```bash
npm install pm2 pm2-logrotate
pm2 start server.js --name "moumroh-api"
pm2 logs moumroh-api
```

## Scaling Strategy

**Phase 1 (MVP):**
- Single server deployment
- MongoDB Atlas free tier
- CDN for frontend

**Phase 2 (Growing):**
- Horizontal scaling for backend
- Database optimization
- Redis caching layer

**Phase 3 (Enterprise):**
- Kubernetes orchestration
- Multi-region deployment
- Advanced monitoring

## Backup Strategy

1. Enable MongoDB Atlas automatic backups
2. Regular code repository backups
3. Document configuration backups

## Security Checklist

- [ ] Environment variables configured
- [ ] CORS properly set
- [ ] HTTPS/SSL enabled
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Monitoring/alerting setup
- [ ] Error logging configured

## Troubleshooting

**Issue: API not connecting**
- Check `REACT_APP_API_URL` environment variable
- Verify backend service is running
- Check CORS settings

**Issue: Slow loading**
- Enable caching
- Optimize database queries
- Use CDN for assets

**Issue: Database connection errors**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database is running

---

For detailed platform-specific guides, refer to each provider's documentation.
