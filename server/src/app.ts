import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import env from './util/validateEnv';
import morgan from 'morgan';
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 1000,
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_CONNECT,
		}),
	})
);

app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);

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
