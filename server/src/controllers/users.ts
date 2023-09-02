import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.session.userId).select('+email');
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

interface SignUpBody {
	username?: string;
	email?: string;
	password?: string;
}

export const signUp: RequestHandler<
	unknown,
	unknown,
	SignUpBody,
	unknown
> = async (req, res, next) => {
	try {
		if (!req.body.username || !req.body.email || !req.body.password)
			throw createHttpError(400, 'Parameters missing');

		const existingUsername = await UserModel.findOne({
			username: req.body.username,
		});
		if (existingUsername)
			throw createHttpError(
				409,
				'Username already taken. Please choose a different one or log in instead.'
			);

		const existingEmail = await UserModel.findOne({
			email: req.body.email,
		});
		if (existingEmail)
			throw createHttpError(
				409,
				'A user with this email address already exists. Please log in instead.'
			);

		const passwordHashed = await bcrypt.hash(req.body.password, 10);

		const newUser = await UserModel.create({
			username: req.body.username,
			email: req.body.email,
			password: passwordHashed,
		});

		req.session.userId = newUser._id;
		console.log('req.session', req.session);
		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
};

interface LoginBody {
	username?: string;
	password?: string;
}

export const login: RequestHandler<
	unknown,
	unknown,
	LoginBody,
	unknown
> = async (req, res, next) => {
	try {
		if (!req.body.username || !req.body.password)
			throw createHttpError(400, 'Parameters Missing.');

		const user = await UserModel.findOne({
			username: req.body.username,
		}).select('+password +email');

		if (!user) throw createHttpError(401, 'Invalid credentials.');

		const passwordMatch = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!passwordMatch) throw createHttpError(401, 'Invalid credentials.');

		req.session.userId = user._id;

		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};

export const logout: RequestHandler = async (req, res, next) => {
	// session.destroy() doesn't return a promise, so we use a callback function
	req.session.destroy((err) => {
		if (err) next(err);
		else res.sendStatus(200);
	});
};
