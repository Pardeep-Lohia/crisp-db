# Backend API

This is the backend API for the Zeon project, built with Node.js and Express. It provides endpoints for managing companies, plans, conversations, messages, knowledge bases, and related entities in a MongoDB database.

## Features

- **Company Management**: Create, view, and update company information, including status management and API key generation.
- **Plan Management**: Handle subscription plans with CRUD operations, including plan features.
- **Conversation Handling**: Manage conversations, messages, and visitor interactions.
- **Knowledge Base**: Store and manage knowledge base entries for AI responses.
- **User Management**: Handle company users and authentication.
- **Token Usage Tracking**: Monitor and track API token usage.
- **Authentication**: JWT-based authentication for secure access.
- **Rate Limiting**: Middleware to prevent abuse.
- **Error Handling**: Global error handling for robust API responses.
- **CORS Support**: Cross-origin resource sharing enabled.
- **File Uploads**: Support for image and file uploads via Multer and Cloudinary.

## Installation

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` and update the values as needed.
   - Ensure MongoDB URI, PORT, JWT_SECRET, and CORS_ORIGIN are configured.

4. Start the development server:
   ```
   npm run dev
   ```

   Or format code:
   ```
   npm run format
   ```

The server will run on the port specified in `.env` (default: 5000).

## Usage

The API is structured around RESTful endpoints. Use tools like Postman or curl to interact with the endpoints.

### Base URL

```
http://localhost:5000
```

## API Endpoints

### Plans

- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create a new plan
- `GET /api/plans/:id` - Get plan details by ID

### Companies

- `POST /company/companies` - Create a new company (with admin user, plan, and API key)
- `GET /company/companies` - View all companies with active plans
- `PATCH /company/companies/:id/status` - Update company status (active, inactive, blocked)

### Conversations

- Endpoints for managing conversations, messages, and visitor interactions (implementation in progress).

### Super Admin

- Administrative endpoints for system management.

## Project Structure

```
backend/
├── src/
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   ├── controllers/       # Route controllers
│   │   ├── company.controller.js
│   │   ├── conversation.controller.js
│   │   ├── knowledgeBase.controller.js
│   │   ├── plan.controller.js
│   │   └── superAdmin.controller.js
│   ├── db/                # Database connection
│   │   └── db.js
│   ├── middlewares/       # Custom middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimiter.middleware.js
│   ├── models/            # Mongoose models
│   │   ├── ApiKey.model.js
│   │   ├── Company.model.js
│   │   ├── CompanyUser.model.js
│   │   ├── Conversation.model.js
│   │   ├── KnowledgeBase.model.js
│   │   ├── Message.model.js
│   │   ├── Plan.model.js
│   │   ├── PlanFeature.model.js
│   │   ├── TokenUsage.model.js
│   │   └── Visitors.model.js
│   ├── routes/            # API routes
│   │   ├── company.route.js
│   │   ├── conversation.route.js
│   │   ├── plan.routes.js
│   │   └── superadmin.route.js
│   ├── app.js            # Express app setup
│   └── index.js          # Main entry point
├── public/               # Static files
├── .env                  # Environment variables
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
├── package-lock.json
└── README.md             # This file
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origins

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling
- `mongoose-aggregate-paginate-v2`: Pagination plugin for Mongoose
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token handling
- `cookie-parser`: Cookie parsing middleware
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `multer`: File upload handling
- `cloudinary`: Cloud image storage
- `axios`: HTTP client
- `moment`: Date manipulation
- `socket.io-client`: WebSocket client
- `crypto`: Cryptographic functions
- `nodemon`: Development server (dev dependency)
- `prettier`: Code formatter (dev dependency)

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.

## License

ISC License
