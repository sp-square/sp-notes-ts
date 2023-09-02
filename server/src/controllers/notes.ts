import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import NoteModel from '../models/note';
import createHttpError from 'http-errors';
import { assertIsDefined } from '../util/assertIsDefined';

export const getNotes: RequestHandler = async (req, res, next) => {
	try {
		assertIsDefined(req.session.userId);

		const notes = await NoteModel.find({ userId: req.session.userId });
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const getNote: RequestHandler = async (req, res, next) => {
	try {
		assertIsDefined(req.session.userId);

		if (!mongoose.isValidObjectId(req.params.noteId)) {
			throw createHttpError(400, 'Invalid note id.');
		}

		const note = await NoteModel.findById(req.params.noteId);

		if (!note) {
			throw createHttpError(404, 'Note not found.');
		}

		if (!note.userId.equals(req.session.userId)) {
			throw createHttpError(403, 'Not authorized.');
		}

		res.status(200).json(note);
	} catch (err) {
		next(err);
	}
};

interface CreateNoteBody {
	title?: string;
	text?: string;
	topic?: string;
}

export const createNote: RequestHandler<
	unknown,
	unknown,
	CreateNoteBody,
	unknown
> = async (req, res, next) => {
	try {
		assertIsDefined(req.session.userId);

		if (!req.body.title) {
			throw createHttpError(400, 'Note must have a title.');
		}
		if (!req.body.topic) {
			throw createHttpError(400, 'Note must have a topic.');
		}
		const newNote = await NoteModel.create({
			...req.body,
			userId: req.session.userId,
		});
		res.status(201).json(newNote);
	} catch (err) {
		next(err);
	}
};

interface UpdateNoteBody {
	title?: string;
	text?: string;
	topic?: string;
}

interface UpdateNoteParams {
	noteId: string;
}

export const updateNote: RequestHandler<
	UpdateNoteParams,
	unknown,
	UpdateNoteBody,
	unknown
> = async (req, res, next) => {
	try {
		assertIsDefined(req.session.userId);

		if (!mongoose.isValidObjectId(req.params.noteId)) {
			throw createHttpError(400, 'Invalid note id.');
		}
		if (!req.body.title) {
			throw createHttpError(400, 'Note must have a title.');
		}
		if (!req.body.topic) {
			throw createHttpError(400, 'Note must have a topic.');
		}

		const note = await NoteModel.findById(req.params.noteId);

		if (!note) {
			throw createHttpError(404, 'Note not found.');
		}

		if (!note.userId.equals(req.session.userId)) {
			throw createHttpError(403, 'Not authorized.');
		}

		note.title = req.body.title;
		note.text = req.body.text;
		note.topic = req.body.topic;

		const updatedNote = await note.save();

		res.status(200).json(updatedNote);
	} catch (err) {
		next(err);
	}
};

export const deleteNote: RequestHandler = async (req, res, next) => {
	try {
		assertIsDefined(req.session.userId);

		if (!mongoose.isValidObjectId(req.params.noteId)) {
			throw createHttpError(400, 'Invalid note id.');
		}

		const note = await NoteModel.findById(req.params.noteId);

		if (!note) {
			throw createHttpError(404, 'Note not found.');
		}

		if (!note.userId.equals(req.session.userId)) {
			throw createHttpError(403, 'Not authorized.');
		}

		await note.remove();

		res.sendStatus(204);
	} catch (err) {
		next(err);
	}
};
