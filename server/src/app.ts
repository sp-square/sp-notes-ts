import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';
import notesRoutes from './routes/notes';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/notes', notesRoutes);

// middleware: wrong endpoint handler
app.use((req, res, next) => {
	next(createHttpError(404, 'Endpoint not found'));
});

// middleware: error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
	let errorMsg = 'An unknown error occurred.';
	let statusCode = 500;

	if (isHttpError(err)) {
		statusCode = err.status;
		errorMsg = err.message;
	}

	res.status(statusCode).json({ error: errorMsg });
});

export default app;
