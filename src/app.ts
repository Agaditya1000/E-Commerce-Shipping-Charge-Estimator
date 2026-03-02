import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sanitize URLs: strip trailing whitespace, invisible chars, and copy-paste artifacts
app.use((req, res, next) => {
    req.url = req.url.replace(/[\s\r\n\u200B-\u200D\uFEFF\u00A0\u2192\u2190\u2794]+$/g, '');
    req.url = req.url.replace(/%20+$/, '');
    next();
});

// Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;
