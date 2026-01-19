# Backend API

This is the backend API for the Zeon project, built with Node.js and Express. It provides endpoints for managing companies, plans, conversations, and related entities in a MongoDB database.

## Features

- **Company Management**: Create, view, and update company information, including status management.
- **Plan Management**: Handle subscription plans with CRUD operations.
- **Conversation Handling**: Manage conversations, messages, and knowledge bases (in development).
- **Authentication**: JWT-based authentication for secure access.
- **Rate Limiting**: Middleware to prevent abuse.
- **Error Handling**: Global error handling for robust API responses.
- **CORS Support**: Cross-origin resource sharing enabled.

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
   - Ensure MongoDB URI, PORT, and JWT_SECRET are configured.

4. Start the server:
   ```
   npm start
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
- `PATCH /company/companies/:id/status` - Update company status

### Conversations (In Development)

- Endpoints for managing conversations, messages, and knowledge bases.

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── companyController.js
│   ├── conversationController.js
│   ├── KnowledgeBaseContoller.js
│   ├── planController.js
│   └── superAdminController.js
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── error.js           # Error handling
│   └── rateLimiter.js     # Rate limiting
├── models/
│   ├── Company.js
│   ├── CompanyApiKey.js
│   ├── CompanyPlan.js
│   ├── CompanyUser.js
│   ├── Conversation.js
│   ├── EndUser.js
│   ├── HandoverLog.js
│   ├── KnowledgeBase.js
│   ├── Message.js
│   ├── Plan.js
│   ├── SuperAdmin.js
│   └── TokenUsage.js
├── routes/
│   ├── companyRoutes.js
│   ├── conversationRoutes.js
│   ├── planRoutes.js
│   └── superAdminRoutes.js
├── .env                   # Environment variables
├── package.json
├── package-lock.json
├── server.js              # Main server file
└── README.md              # This file
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens

## Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `moment`: Date handling
- `uuid`: Unique identifier generation

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.

## License

ISC License
