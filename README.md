# Academic Research Collaboration Platform

A production-ready full-stack platform enabling academic researchers to collaborate on projects, share documents, and communicate in real-time.

## 🚀 Quick Start

### Development Mode

**Terminal 1: Frontend**
```bash
npm run dev
```

**Terminal 2: Backend**
```bash
npm run mock:server
```

Visit `http://localhost:5173/` and login with:
- Email: `pardhuswaroop.ch@gmail.com`
- Password: `123456`

> **Tip:** register a new account and enter `ADMIN123` in the **Admin Code** field to create an administrator. This demo value is evaluated on the front-end and back-end; in production use a proper invitation flow.

You can also exercise the forgot/reset password flow:
1. Click **Forgot Password** on the login page.
2. The mock server prints a reset token to its console.
3. Visit `/reset-password` to enter the token and a new password.

### Production Build

```bash
npm run build
# Output: dist/ folder (94 KB gzipped)
npm run preview  # Preview production build locally
```

## 📋 Features

✅ **Authentication** - Token-based auth with localStorage persistence
✅ **Protected Routes** - PrivateRoute components with auto-redirect
✅ **Project Management** - Create, view, and manage research projects
✅ **Document Sharing** - Upload and manage project files
✅ **Team Messaging** - Real-time chat interface
✅ **Admin Dashboard** - Full CRUD operations
✅ **Tailwind UI** - Professional academic theme with responsive design
✅ **API Integration** - Axios with interceptors for token handling

## 🛠 Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **HTTP:** Axios with token interceptors
- **State:** Context API
- **Backend:** Node.js + Express (mock server)
- **Database:** JSON file (db.json)

## 📁 Project Structure

```
src/
├── components/       # Navbar, Sidebar, ProjectCard, DocumentUpload, ChatBox
├── pages/           # Login, Register, Dashboard, Projects, Documents, Messages, Admin
├── context/         # AuthContext for auth state
├── services/        # api.js with token handling
└── App.jsx          # Routing and main layout
```

## 🚢 Deployment

Multiple deployment options available:

### Frontend
- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Easy GitHub integration
- **GitHub Pages** - Free static hosting

### Backend
- **Render** (recommended) - Easy GitHub integration
- **Railway** - All-in-one platform
- **AWS Lambda** - Serverless option
- **Docker** - Self-hosted

See [DEPLOY.md](DEPLOY.md) for detailed guides for each platform.

## 📖 Documentation

- [SETUP.md](SETUP.md) - Installation, API endpoints, customization
- [DEPLOY.md](DEPLOY.md) - Deployment guides for popular platforms

## 🔑 Test Credentials

```
Email:    pardhuswaroop.ch@gmail.com
Password: 123456
```

## ⚙️ API Endpoints

### Public (No Auth)
- `GET /users?email=<email>&password=<password>` - Login
- `POST /users` - Register

### Protected (Requires Bearer Token)
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /documents?projectId=<id>` - List documents
- `POST /documents` - Upload document
- `GET /messages?projectId=<id>` - List messages
- `POST /messages` - Send message

## 🔒 Security

✅ Token-based authentication
✅ Protected endpoints with 401 validation
✅ Automatic token attachment via axios interceptor
✅ 401 handling with auto-logout
✅ PrivateRoute components
✅ Session persistence in localStorage

## � Authentication & Roles

The platform supports two roles:

- `researcher` (default) — normal users who can view projects, upload documents, and chat.
- `admin` — has access to the admin dashboard, can manage projects and researchers.

Role is encoded in the JWT and stored in `localStorage` along with the token. Protected routes use a custom `<PrivateRoute role="..." />` component. API endpoints enforce permissions via middleware.

Passwords are hashed with **bcrypt** and tokens expire after two hours. The backend is file‑based (`db.json`) but can be swapped for a real database easily.

## �📦 Scripts

```bash
npm run dev           # Start dev server
npm run mock:server   # Start mock API
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## 🎨 Customization

### Update API URL
Edit `src/services/api.js` or set `VITE_API_URL` environment variable.

### Change Theme Colors
Edit `tailwind.config.cjs` to customize the academic color palette.

### Update Mock Data
Edit `db.json` to modify users, projects, documents, and messages.

## 📱 Responsive Design

- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)  
- ✅ Desktop (> 1024px)

## 🐛 Troubleshooting

**Port in use?**
```bash
npm run dev -- --port 5174
```

**Missing dependencies?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection issues?**
- Verify backend server is running (`npm run mock:server`)
- Check `VITE_API_URL` environment variable
- Verify CORS headers if deploying

## 📄 License

MIT

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements!
