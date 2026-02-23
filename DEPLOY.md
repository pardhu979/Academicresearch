# Deployment Guide

This guide covers deploying the Academic Research Collaboration Platform to various hosting platforms.

## Build Output

The production build generates:
- `dist/index.html` — Main HTML file (0.46 KB)
- `dist/assets/index-*.css` — Compiled Tailwind CSS (2.76 KB gzipped)
- `dist/assets/index-*.js` — Bundled React app (91.44 KB gzipped)

**Total size: ~94 KB gzipped** (highly optimized)

---

## Option 1: Deploy Frontend to Vercel (Recommended)

Vercel is the easiest platform for Vite+React apps with zero-config deployment.

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   vercel
   ```
   - Select "academic-research" as project name
   - Accept defaults for most prompts
   - Frontend will be live at `https://<project>.vercel.app`

4. **Configure API URL**
   Create `src/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
   Update `src/services/api.js`:
   ```javascript
   const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
   ```

5. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## Option 2: Deploy Backend to Render (Recommended)

Render is a modern platform for deploying Node.js servers.

### Steps

1. **Create Render Account**
   - Go to https://render.com and sign up

2. **Connect GitHub** (or push code to GitHub)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Create New Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `node server.js`

4. **Add Environment Variables**
   In Render dashboard, add:
   ```
   NODE_ENV=production
   PORT=4000
   ```

5. **Get Backend URL**
   - Copy the service URL (e.g., `https://api-academic.onrender.com`)
   - Update frontend `VITE_API_URL` to this URL

---

## Option 3: Deploy Both to Railway

Railway is an all-in-one platform for full-stack deployments.

### Frontend

1. **Connect GitHub repo**
2. **Add project:** Frontend
3. **Build command:** `npm run build`
4. **Start command:** `npm run preview`
5. **Environment:** Set `VITE_API_URL`

### Backend

1. **Add service:** Backend
2. **Build command:** `npm install`
3. **Start command:** `node server.js`
4. **Environment:** Set `NODE_ENV=production`

---

## Option 4: Deploy to Netlify + AWS Lambda

### Frontend on Netlify

1. **Push code to GitHub**
2. **Connect Netlify to GitHub**
3. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Add redirect for SPA:**
   Create `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Backend on AWS Lambda

1. **Prepare code:**
   ```bash
   npm install serverless-offline
   ```

2. **Create `serverless.yml`:**
   ```yaml
   service: academic-research-api
   
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
   
   functions:
     api:
       handler: server.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
   ```

3. **Deploy:**
   ```bash
   serverless deploy
   ```

---

## Option 5: Docker Deployment (Self-Hosted)

### Create Dockerfile

Save as `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5173:5173"
      - "4000:4000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./db.json:/app/db.json
```

### Deploy

```bash
docker-compose up -d
```

---

## Environment Variables Setup

Create `.env.production` for frontend:
```
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=Academic Research
```

Update `src/services/api.js`:
```javascript
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
})
```

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Login/Register works
- [ ] Projects page fetches data
- [ ] Can upload documents
- [ ] Can send messages
- [ ] 401 handling redirects to login
- [ ] Production build is minified (~94 KB)
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured correctly

---

## Troubleshooting

**CORS Errors**
Add to `server.js`:
```javascript
const cors = require('cors')
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}))
```

**API URL Not Updating**
- Clear browser cache
- Check `.env.production` file exists
- Run `npm run build` after changes

**Token Issues**
- Verify token format in localStorage
- Check Authorization header in network tab
- Ensure backend token validation middleware is active

**db.json Not Persisting**
- Use environment variable for data path
- Configure persistent storage on hosting platform
- Consider migrating to a proper database

---

## Recommended Stack

**For Development:**
- Frontend: Vite dev server (local)
- Backend: Node.js (local)

**For Production:**
- Frontend: Vercel (zero-config, CDN included)
- Backend: Render (easy GitHub integration)
- Database: PostgreSQL or MongoDB (add to backend)

**Quick Deploy Command:**
```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel --prod

# Backend auto-deploys from GitHub on Render
```

---

## Next Steps

1. Choose deployment platform (Vercel + Render recommended)
2. Set up GitHub repository
3. Connect platform to GitHub
4. Update API URL in frontend
5. Test all features in production
6. Monitor logs and errors

For platform-specific help, refer to:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Railway: https://railway.app/docs
- Netlify: https://docs.netlify.com
