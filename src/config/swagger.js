import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Garage API',
      version: '1.0.0',
      description: 'API documentation for Garage Car Repair System',
    },
    servers: [
      { url: 'https://garage-ucu3.onrender.com/', description: 'Production server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Role: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '650f2a1e5a6c3f4a2c9b1234' },
            title: { type: 'string', example: 'Administrator' },
            value: { type: 'string', example: 'admin' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65102f3c8b4a1c7d4a9e1234' },
            title: { type: 'string', example: 'View Dashboard' },
            value: { type: 'string', example: 'view_dashboard' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '651045bc9b1a3c2d4e8f1234' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            password: { type: 'string', example: '$2b$10$hashedpassword' },
            refresh_token: { type: 'string', nullable: true },
            role_id: { type: 'string', example: '650f2a1e5a6c3f4a2c9b1234' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ServiceCatalog: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6510abcd1234ef567890abcd' },
            name: { type: 'string', example: 'Oil Change' },
            description: { type: 'string', example: 'Complete engine oil replacement' },
            price: { type: 'number', example: 50 },
            estimated_time: { type: 'number', example: 30 },
            image: { type: 'string', example: 'https://example.com/images/oil-change.jpg' },
            discount: { type: 'number', example: 10 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6510bcde1234ef567890bcde' },
            address: { type: 'string', example: '123 Main St, Springfield' },
            user_id: { type: 'string', example: '651045bc9b1a3c2d4e8f1234' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6510bcde1234ef567890bcdf' },
            customer_id: { type: 'string', example: '651045bc9b1a3c2d4e8f1234' },
            make: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Corolla' },
            year: { type: 'integer', example: 2022 },
            vin: { type: 'string', example: '1HGCM82633A123456' },
            license_plate: { type: 'string', example: 'DHA-1234' },
            color: { type: 'string', example: 'Black' },
            mileage: { type: 'number', example: 45200 },
            fuel_type: { type: 'string', enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'], example: 'petrol' },
            transmission: { type: 'string', enum: ['manual', 'automatic', 'cvt', 'semi-automatic'], example: 'automatic' },
            last_service_date: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00.000Z' },
            next_service_due: { type: 'string', format: 'date-time', example: '2025-07-15T10:30:00.000Z' },
            notes: { type: 'string', example: 'Customer requested synthetic oil only' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
