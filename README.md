[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19830763&assignment_repo_type=AssignmentRepo)
# Express.js RESTful API Assignment

## Overview
This project is a RESTful API for managing products, built with Express.js. It demonstrates CRUD operations, middleware, error handling, filtering, pagination, search, and statistics endpoints.

## Key Technologies
- **Express.js**: Web framework for Node.js, used to build the API and handle routing/middleware.
- **body-parser**: Middleware to parse incoming JSON request bodies.
- **uuid**: Library to generate unique IDs for products.

## How to Run the Server
1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set your environment variables (optional, defaults are provided).
3. Start the server:
   ```
   npm start
   ```
4. The server will run on `http://localhost:3000` by default.

## Environment Variables
- `PORT`: Port for the server (default: 3000)
- `API_KEY`: API key required in the `x-api-key` header for all `/api/products` endpoints (default: mysecretkey)

## API Endpoints

### Authentication
All `/api/products` endpoints require the header:
```
x-api-key: mysecretkey
```

### CRUD Endpoints
- `GET /api/products` - List all products (supports filtering and pagination)
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Advanced Endpoints
- `GET /api/products?category=electronics&page=1&limit=2` - Filter by category and paginate
- `GET /api/products/search?name=coffee` - Search products by name
- `GET /api/products/stats` - Get product count by category

### Example Requests

#### Create a Product
```
POST /api/products
Headers: { "x-api-key": "mysecretkey" }
Body:
{
  "name": "Tablet",
  "description": "10-inch Android tablet",
  "price": 300,
  "category": "electronics",
  "inStock": true
}
```

#### Get All Products (Paginated)
```
GET /api/products?page=1&limit=2
Headers: { "x-api-key": "mysecretkey" }
```

#### Search by Name
```
GET /api/products/search?name=coffee
Headers: { "x-api-key": "mysecretkey" }
```

#### Get Statistics
```
GET /api/products/stats
Headers: { "x-api-key": "mysecretkey" }
```

### Example Error Response
```
{
  "error": "Product not found"
}

{
  "error": "Unauthorized - Invalid or missing API key"
}
```

## Notes
- All data is stored in-memory (no database).
- Use Postman, Insomnia, or curl for testing.

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 