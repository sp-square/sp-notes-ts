import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';

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

		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
};
