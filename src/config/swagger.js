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
      { url: 'http://localhost:5000', description: 'Development server' }
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
        }
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
