import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import NoteModel from '../models/note';
import createHttpError from 'http-errors';

export const getNotes: RequestHandler = async (req, res, next) => {
	try {
		const notes = await NoteModel.find();
		res.status(200).json(notes);
	} catch (err) {
		next(err);
	}
};

export const getNote: RequestHandler = async (req, res, next) => {
	try {
		if (!mongoose.isValidObjectId(req.params.noteId)) {
			throw createHttpError(400, 'Invalid note id.');
		}

		const note = await NoteModel.findById(req.params.noteId);

		if (!note) {
			throw createHttpError(404, 'Note not found.');
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
		if (!req.body.title) {
			throw createHttpError(400, 'Note must have a title.');
		}
		if (!req.body.topic) {
			throw createHttpError(400, 'Note must have a topic.');
		}
		const newNote = await NoteModel.create(req.body);
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
		if (!mongoose.isValidObjectId(req.params.noteId)) {
			throw createHttpError(400, 'Invalid note id.');
		}

		const note = await NoteModel.findById(req.params.noteId);

		if (!note) {
			throw createHttpError(404, 'Note not found.');
		}

		await note.remove();

		res.sendStatus(204);
	} catch (err) {
		next(err);
	}
};
