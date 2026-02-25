# Academic Research Collaboration Platform

A modern web-based platform that enables academic researchers to collaborate on projects, share documents, and communicate in real-time.

## Features

✅ **Authentication & Authorization**
- User login and registration with persistent token-based auth
- Protected routes with automatic redirect on 401
- Mock token validation on all protected endpoints

✅ **Project Management**
- Create, view, and manage research projects
- Project details with team member info
- Admin dashboard for full CRUD operations

✅ **Document Sharing**
- Upload and manage project documents
- File metadata tracking (name, size, date)
- Download support structure

✅ **Team Communication**
- Real-time chat/messaging interface
- Message history and timestamps
- Project-scoped conversations

✅ **Admin Dashboard**
- Create and delete projects
- View platform statistics
- User and project management

✅ **UI/UX**
- Tailwind CSS with academic theme
- Responsive design (mobile, tablet, desktop)
- Clean, professional interface
- Accessibility-focused components

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **State Management:** Context API
- **HTTP Client:** Axios with interceptors
- **Backend:** Node.js + Express (mock server)
- **Database:** JSON file (json-server compatible)

## Project Structure

```
Academic-research/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Left sidebar navigation
│   │   ├── ProjectCard.jsx  # Project display card
│   │   ├── DocumentUpload.jsx
│   │   └── ChatBox.jsx      # Message interface
│   ├── pages/               # Page-level components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── Documents.jsx
│   │   ├── Messages.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── services/
│   │   └── api.js           # Axios instance with token handling
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx
│   └── index.css            # Tailwind directives
├── db.json                  # Mock database
├── server.js                # Custom Express server with token validation
├── package.json
├── vite.config.js
├── tailwind.config.cjs
└── postcss.config.cjs
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

1. **Clone/Navigate to project directory**
   ```bash
   cd Academic-research
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list react react-dom react-router-dom axios
   ```

## Running the Application

### Option 1: Development Mode (Recommended)

**Terminal 1 - Frontend Dev Server:**
```bash
npm run dev
```
The Vite dev server will start and display the local URL (typically `http://localhost:5173/`).

**Terminal 2 - Mock API Server:**
```bash
npm run mock:server
```
The mock API server will start on `http://localhost:4000/` with token validation enabled.

### Option 2: Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` — Start Vite dev server with hot reload
- `npm run mock:server` — Start Express mock API server with token validation
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint checks

## Test Credentials

Use these credentials to test the application:

```
Email:    alice@example.com
Password: password123
```

Additional test users in `db.json`:
- `bob@example.com` / `password123`
- `pardhuswaroop.ch@gmail.com` / `123456`

## API Endpoints

### Public (No Auth Required)
- `GET /users?email=<email>&password=<password>` — Login
- `POST /users` — Register new user

### Protected (Requires `Authorization: Bearer <token>`)
- `GET /projects` — List all projects
- `GET /projects/:id` — Get project details
- `POST /projects` — Create project (admin)
- `DELETE /projects/:id` — Delete project (admin)

- `GET /documents?projectId=<id>` — List documents
- `POST /documents` — Upload document

- `GET /messages?projectId=<id>` — List messages
- `POST /messages` — Send message

## Authentication Flow

1. **Login/Register** → Get mock token (no auth required)
2. **Token Storage** → Stored in `localStorage` via AuthContext
3. **Request Attachment** → Axios interceptor adds `Authorization: Bearer <token>` header
4. **Token Validation** → Express middleware validates token on protected routes
5. **401 Handling** → If unauthorized, axios interceptor clears auth and redirects to `/login`

## Security Features

✅ Token-based authentication
✅ Protected API endpoints (401 validation)
✅ Automatic token attachment to requests
✅ 401 error handling with auto-logout
✅ Protected routes with PrivateRoute component
✅ Session persistence in localStorage

## Customization

### Update API Base URL
Edit `src/services/api.js`:
```javascript
const instance = axios.create({
  baseURL: 'http://your-api-url:port'
})
```

### Update Mock Data
Edit `db.json` to add/modify:
- Users
- Projects
- Documents
- Messages

### Customize Theme Colors
Edit `tailwind.config.cjs`:
```javascript
theme: {
  extend: {
    colors: {
      acad: {
        50: '#f5f9ff',
        100: '#e6f0ff',
        500: '#1e6fb8',
        700: '#15507a'
      }
    },
  },
}
```

## Troubleshooting

**Port Already in Use**
```bash
# Change frontend port
npm run dev -- --port 5174

# Change backend port (edit server.js PORT constant)
```

**Token Validation Errors**
- Ensure the mock server is running (`npm run mock:server`)
- Check Authorization header is being sent
- Verify token format: `Bearer mock-token-<userId>`

**CORS Issues**
- Add CORS middleware to `server.js` if needed
- Check frontend and backend URLs match

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Start both servers (frontend + backend)
2. Open browser to frontend URL
3. Login with test credentials
4. Navigate through pages
5. Create/update projects, documents, messages
6. Edit `db.json` to reset mock data
7. Hot reload applies changes automatically

## Deployment Notes

For production deployment:
1. Build frontend: `npm run build` → outputs `dist/`
2. Deploy `dist/` to static hosting (Vercel, Netlify, etc.)
3. Deploy `server.js` to Node.js hosting (Render, Railway, Heroku, etc.)
4. Update `api.js` baseURL to production backend URL
5. Use environment variables for sensitive configs

## License

MIT

## Support

For issues or questions, refer to the component and page files for implementation details.
