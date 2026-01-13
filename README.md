# CineVerse

CineVerse is a comprehensive movie and anime review and management platform. It allows users to discover, track, and review their favorite content.

## 🚀 Features

*   **Movie & Anime Management:** Browse and manage your watchlist.
*   **Reviews & Ratings:** Share your thoughts and rate titles.
*   **User Authentication:** Secure login and registration (JWT-based).
*   **Responsive Design:** optimized for various devices.

## 🛠️ Technology Stack

### Frontend
*   **Framework:** [Vue 3](https://vuejs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **UI Framework:** [Bootstrap 5](https://getbootstrap.com/)
*   **Data Fetching:** [TanStack Query (Vue Query)](https://tanstack.com/query/latest)
*   **Form Validation:** Vee-Validate & Zod
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** PostgreSQL
*   **Query Builder:** [Knex.js](https://knexjs.org/)
*   **Authentication:** JWT (JSON Web Tokens) & Bcrypt
*   **API Documentation:** Swagger UI

## 📂 Project Structure

```
CineVerse/
├── backend/            # Express.js API Server
├── frontend/           # Vue 3 Client Application
├── ecosystem.config.js # PM2 Configuration
└── README.md           # Project Documentation
```

## 🔧 Installation & Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   PostgreSQL installed and running

### 1. clone the repository
```bash
git clone <repository_url>
cd CineVerse
```

### 2. Setup Backend
```bash
cd backend
npm install
```
*   Create a `.env` file in the `backend` directory with your database and JWT configuration (DB_HOST, DB_USER, DB_PASS, JWT_SECRET, etc.).
*   Run database migrations (if applicable via Knex).
*   Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
*   Start the development server:
```bash
npm run dev
```

## 📜 API Documentation
Once the backend is running, you can access the Swagger API documentation at:
`http://localhost:<PORT>/api-docs` (Adjust port as configured).

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
