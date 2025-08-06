import express, { Express, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (res: Response) => {
  res.json({
    message: 'Root endpoint',
  });
});

app.get('/health', (res: Response) => {
  res.status(200).json({
    status: 'OK',
  });
});

app.use('/api', routes)

// 404 handler
app.use('*', (res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;