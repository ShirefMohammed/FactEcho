# FactEcho - News Application

## Table of Contents
- [Project Overview](#project-overview)
- [Live Demos](#live-demos)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [SDLC](#sdlc)
- [Sample Database Design](#sample-database-design)
- [Sample API Documentation](#sample-api-documentation)
- [Installation](#installation)
- [Future Plans](#future-plans)
- [Conclusion](#conclusion)

---

## Project Overview

**FactEcho** is a full-stack news application built with the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js). FactEcho is a **news platform** that provides users with **real-time, categorized news** across various fields such as politics, sports, and technology. The app is designed with a focus on **user experience, security, reliability, and scalability**. It includes features like **user authentication, article management, and admin dashboards**. The project is built with modern web technologies and follows best practices for **full-stack development**.

The app is currently available as a **web application**, with plans to expand to mobile platforms and introduce community engagement features in future versions.

---

## Live Demos:
- **Server**: [https://factecho-node-server.vercel.app/](https://factecho-node-server.vercel.app/)
- **React Client**: [https://factecho-react-client.vercel.app/](https://factecho-react-client.vercel.app/)
- **Next.js Client**: [https://factecho-next-client.vercel.app/](https://factecho-next-client.vercel.app/)

---

## Key Features

### 🛠 **Core Functionalities**
- **User Authentication**: Secure registration, login, and password reset with **JWT** and **OAuth** (Google and Facebook).
- **User Profile**: Nice profile sections such as account, reading-list, news-letters and settings.
- **News Categories**: Organized news sections for easy browsing (e.g., politics, sports, technology).
- **Article Management**: Create, read, update, and delete articles with rich media support.
- **Search Functionality**: Users can search for articles by keywords or categories.
- **Admin Dashboard**: Manage users, authors, categories, and articles with granular permissions.
- **Author Dashboard**: Authors can create and manage their articles.

### 🚀 **Future Features**
- **Mobile App**: Cross-platform mobile application for iOS and Android.
- **Community Engagement**: Comments and likes for articles, but save already exists in current version.
- **Email Newsletters**: Admin-controlled newsletters for subscribers.
- **Ads Management**: Monetization through targeted ads.
- **Premium Subscriptions**: Ad-free experience and exclusive content.
- **Analytics Dashboard:** Provide insights into user engagement and article performance.
- **SEO Improvement**: Handling SEO with react or next js depending on further search.

---

## Technologies Used

### Frontend
- **React.js**: For building the user interface.
- **Next.js**: For server-side rendering and SEO optimization.
- **TypeScript**: For type-safe development.
- **Tailwind CSS**: For responsive and modern UI design.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **TypeScript**: For type-safe development.
- **PostgreSQL**: For robust and scalable database management.
- **Node-Cache**: For caching.

### Authentication
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **OAuth**: Integration with Google and Facebook for social login.

### Media Storage
- **Cloudinary**: For storing and managing images and media.

### Hosting
- **Vercel**: For hosting the frontend and backend.
- **Neon**: Managed PostgreSQL database for production.

### Tools
- **Swagger**: For API documentation.
- **Jest**: For testing.
- **Draw.io**: For ERD and system design.

---

## SDLC

### 🚀 **Planning & Analysis**
- Result: [PRD](./docs/PRD.md) (Product Requirements Document) outlining goals and user stories.

### 🎨 **Design**
- Result: [ERD](./docs/ERD.md) (Entity-Relationship Diagram) and system architecture diagrams.

### 💻 **Development**
- Followed modular architecture.
- Code structured in `server`, `client/react`, `client/next`, and `shared` directories.
- Implemented CI/CD pipelines for efficient deployment.

### 🧪 **Testing**
- **Unit Testing:** Covered utility functions using Jest.
- **Integration Testing:** Verified endpoints with PostgreSQL.
- **API Testing:** Documented and tested endpoints via Swagger.
- **Manual Testing:** Verified user flows and UI components.

### 🚀 **Deployment**
- Hosted on **Vercel**:
  - **Server**: [https://factecho-node-server.vercel.app/](https://factecho-node-server.vercel.app/)
  - **React Client**: [https://factecho-react-client.vercel.app/](https://factecho-react-client.vercel.app/)
  - **Next.js Client**: [https://factecho-next-client.vercel.app/](https://factecho-next-client.vercel.app/)

### 🛡️ **Maintenance**
- Ongoing improvements based on user feedback.
- Regular updates for security patches and dependency management.
- Adding new features and performance optimizations.

---

## Sample Database Design

FactEcho uses a **relational database** (PostgreSQL) for structured and scalable data management. Below is the Entity-Relationship Diagram (ERD) for the app:

![ERD](./docs/diagrams/ERD.png)

![Tables](./docs/diagrams/DB_Tables.png)

For more details, refer to the [ERD Documentation](./docs/ERD.md).

---

## Sample API Documentation

FactEcho provides a **RESTful API** for managing auth, users, articles, categories, and more. Below are the **authentication endpoints**:

### Auth Endpoints
- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`
- **OAuth (Google)**: `GET /auth/login/google`
- **OAuth (Facebook)**: `GET /auth/login/facebook`
- **Refresh Token**: `GET /auth/refresh`
- **Logout**: `GET /auth/logout`
- **Verify Account**: `GET /auth/verify-account`
- **Forgot Password**: `POST /auth/forget-password`
- **Reset Password**: `POST /auth/reset-password`

For a complete list of endpoints, refer to the [ERD Documentation](./docs/ERD.md).

---

## Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher)

### Steps

1. **Clone the Repository**:
   ```bash
    git clone https://github.com/ShirefMohammed/FactEcho/
    cd FactEcho
    ```

2. **Handle server:**
    ```
    cd server
    npm install
    ```

    Create a .env file in the root of the server directory with the following content:
    ```
    # Main
    NODE_ENV=development
    CLIENT_URL=http://localhost:5173
    SERVER_URL=http://localhost:3000
    PORT=3000

    # Tokens Secrets
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    VERIFICATION_TOKEN_SECRET=your_verification_token_secret
    RESETPASSWORD_TOKEN_SECRET=your_reset_password_token_secret

    # OAuth
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    FACEBOOK_CLIENT_ID=your_facebook_client_id
    FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

    # Email Service
    EMAIL_SERVICE_USER=your_email
    EMAIL_SERVICE_PASSWORD=your_email_password

    # PostgreSQL Database
    POSTGRESQL_DB_USER=postgres
    POSTGRESQL_DB_HOST=localhost
    POSTGRESQL_DB_DEVELOPMENT_NAME=factecho_development
    POSTGRESQL_DB_PASSWORD=your_db_password
    POSTGRESQL_DB_PORT=5432
    DATABASE_URL=postgres://user:password@localhost:5432/factecho_development

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLOUDINARY_DEFAULT_AVATAR=https://res.cloudinary.com/dtw6e1hhh/image/upload/v1734804997/bwxjp1ez48onhsojdrsm.jpg

    # Allowed Origins
    ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:4173
    ```

    ```
    npm run dev
    ```

    Navigate to http://localhost:3000 in your browser.

3. Handle react client:
    ```
    cd client/react
    npm install
    ```

    Create a .env.local file in the root of the client/react directory with the following content:
    ```
    # Main
    VITE_NODE_ENV=development
    VITE_CLIENT_URL=http://localhost:5173
    VITE_SERVER_URL=http://localhost:3000

    # Cloudinary
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
    VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    VITE_CLOUDINARY_DEFAULT_AVATAR=https://res.cloudinary.com/dtw6e1hhh/image/upload/v1734804997/bwxjp1ez48onhsojdrsm.jpg
    VITE_CLOUDINARY_MY_UPLOAD_PRESET=your_upload_preset
    VITE_CLOUDINARY_MY_UPLOAD_FOLDER=your_upload_folder
    ```

    ```
    npm run dev
    ```

    Navigate to http://localhost:5173/ in your browser.

3. Handle next js client instead of react as you prefer:
    ```
    cd client/next
    npm install
    ```

    Create a .env.local file in the root of the client/next directory with the following content:
    ```
    # Main
    VITE_NODE_ENV=development
    VITE_CLIENT_URL=http://localhost:5173
    VITE_SERVER_URL=http://localhost:3000

    # Cloudinary
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
    VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    VITE_CLOUDINARY_DEFAULT_AVATAR=https://res.cloudinary.com/dtw6e1hhh/image/upload/v1734804997/bwxjp1ez48onhsojdrsm.jpg
    VITE_CLOUDINARY_MY_UPLOAD_PRESET=your_upload_preset
    VITE_CLOUDINARY_MY_UPLOAD_FOLDER=your_upload_folder
    ```

    ```
    npm run dev
    ```

    Navigate to http://localhost:5173/ in your browser.

## Future Plans

- **Mobile App**: Cross-platform mobile application for iOS and Android.
- **Community Engagement**: Comments and likes for articles, but save already exists in current version.
- **Email Newsletters**: Admin-controlled newsletters for subscribers.
- **Ads Management**: Monetization through targeted ads.
- **Premium Subscriptions**: Ad-free experience and exclusive content.
- **Analytics Dashboard:** Provide insights into user engagement and article performance.
- **SEO Improvement**: Handling SEO with react or next js depending on further search.

---

## Conclusion
FactEcho showcases my skills in full-stack development, database design, and API integration. I’m excited to continue improving FactEcho and welcome any feedback or contributions.

If you’re interested in collaborating, feel free to reach out! Let’s build something amazing together.
