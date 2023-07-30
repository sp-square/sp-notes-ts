import { Note } from '../models/note';
import { fetchData } from '../utils/fetchData';

export async function fetchNotes(): Promise<Note[]> {
	const apiResponse = await fetchData('/api/notes', {
		method: 'GET',
	});
	return await apiResponse.json();
}

export interface NoteInput {
	title: string;
	text?: string;
	topic: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
	const apiResponse = await fetchData('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});
	return apiResponse.json();
}

export async function updateNote(
	noteId: string,
	note: NoteInput
): Promise<Note> {
	const apiResponse = await fetchData(`/api/notes/${noteId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});
	return apiResponse.json();
}

export async function deleteNote(noteId: string) {
	await fetchData(`/api/notes/${noteId}`, {
		method: 'DELETE',
	});
}
