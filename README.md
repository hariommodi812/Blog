# BlogBuddy-3

BlogBuddy-3 is a full-stack web application that allows users to create, manage, and view blog posts with a seamless user experience. It includes a Django backend, a modern frontend, and structured API communication between client and server.

---

## 🚀 Features

- 🧠 Django-based backend with session and authentication handling  
- 🎨 Responsive frontend using modern UI/UX frameworks  
- 🔗 RESTful APIs for blog interaction  
- 📦 SQLite database support  
- 🌐 Proxy configuration for seamless dev experience  

---

## 🗂 Project Structure

```
BlogBuddy-3/
├── client/              # Frontend client
├── django_backend/      # Django backend
├── server/              # Node server / API gateway
├── shared/              # Shared resources
├── sessions.sqlite      # SQLite DB for session management
├── run_django.py        # Django server entry point
├── start_django.sh      # Bash script to run the Django server
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite bundler config
└── ...
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/BlogBuddy-3.git
cd BlogBuddy-3
```

### 2. Backend Setup (Django)

Ensure you have Python and pip installed.

```bash
cd django_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Or use the script:
```bash
./start_django.sh
```

### 3. Frontend Setup

Ensure Node.js is installed.

```bash
cd client
npm install
npm run dev
```

### 4. Run the Proxy Server (if applicable)

```bash
cd server
node proxy_server.js
```
