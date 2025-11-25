import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import routes from './routes/index.routes.js';



const server = express();
const PORT = process.env.PORT || 3002;


// Security middleware
server.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Middleware
server.use(cors());
server.use(express.json());


server.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    }
  }
}));

server.use('/api', routes);

// Error handling middleware
server.use((err, req, res, next) => {
  logger.error('Error occurred:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

connectDB();

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});