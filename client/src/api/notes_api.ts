import { Note } from '../models/note';

async function fetchData(endpoint: RequestInfo, options?: RequestInit) {
	const response = await fetch(endpoint, options);
	if (response.ok) {
		return response;
	} else {
		const errorBody = await response.json();
		const errorMsg = errorBody.error;
		throw Error(errorMsg);
	}
}

export async function fetchNotes(): Promise<Note[]> {
	const response = await fetchData('/api/notes', {
		method: 'GET',
	});
	return await response.json();
}

export interface NoteInput {
	title: string;
	text?: string;
	topic: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
	const response = await fetchData('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});
	return response.json();
}

export async function deleteNote(noteId: string) {
	await fetchData(`/api/notes/${noteId}`, {
		method: 'DELETE',
	});
}
