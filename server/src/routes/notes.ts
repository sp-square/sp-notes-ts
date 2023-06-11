import express from 'express';
import {
	getNotes,
	getNote,
	createNote,
	updateNote,
	deleteNote,
} from '../controllers/notes';

const router = express.Router();

router.get('/', getNotes);

router.get('/:noteId', getNote);

router.post('/', createNote);

router.put('/:noteId', updateNote);

router.delete('/:noteId', deleteNote);

export default router;
