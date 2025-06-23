const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const rewardRoutes = require('./routes/rewards');
const transactionRoutes = require('./routes/transactions');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


dotenv.config();



const app = express();

// Connect to MongoDB
connectDB();

// Middleware

app.use(express.json());


const swaggerOptions = {
  definition: require('./swagger.json'),
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/transactions', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('LoyalBox API is running');
});

app.get('/', (req, res) => {
  res.send('Hello from Render!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});