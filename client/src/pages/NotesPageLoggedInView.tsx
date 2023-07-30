import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import * as NotesApi from '../api/notes_api';
import Note from '../components/Note';
import AddEditNoteModal from '../components/modals/AddEditNoteModal';
import { Note as NoteModel } from '../models/note';
import styles from '../styles/NotesPage.module.css';

const NotesPageLoggedInView = () => {
	const [notes, setNotes] = useState<NoteModel[]>([]);
	const [notesLoading, setNotesLoading] = useState(true);
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

	useEffect(() => {
		async function loadNotes() {
			try {
				setShowNotesLoadingError(false);
				setNotesLoading(true);
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (err) {
				console.error(err);
				setShowNotesLoadingError(false);
			} finally {
				setNotesLoading(false);
			}
		}
		loadNotes();
	}, []);

	async function deleteNote(note: NoteModel) {
		try {
			await NotesApi.deleteNote(note._id);
			setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<>
			<Button
				className={`mb-4 w-100 ${styles.addButton}`}
				variant="dark"
				onClick={() => setShowAddNoteModal(true)}
			>
				<FaPlus className="text-warning" />
				Add new note
			</Button>
			{notesLoading && <Spinner animation="border" variant="primary" />}
			{showNotesLoadingError && (
				<p>Something went wrong. Please refresh the page.</p>
			)}
			{!notesLoading && !showNotesLoadingError && (
				<>
					{notes.length > 0 ? (
						<Row xs={1} md={2} xl={3} className="g-4 w-100">
							{notes.map((note) => (
								<Col key={note._id}>
									<Note
										note={note}
										className={styles.note}
										onClickNote={setNoteToEdit}
										onDeleteNote={deleteNote}
									></Note>
								</Col>
							))}
						</Row>
					) : (
						<p>You don't have any notes yet.</p>
					)}
				</>
			)}
			{showAddNoteModal && (
				<AddEditNoteModal
					onDismiss={() => setShowAddNoteModal(false)}
					onNoteSaved={(newNote) => {
						setNotes([...notes, newNote]);
						setShowAddNoteModal(false);
					}}
				/>
			)}
			{noteToEdit && (
				<AddEditNoteModal
					noteToEdit={noteToEdit}
					onDismiss={() => setNoteToEdit(null)}
					onNoteSaved={(updatedNote) => {
						setNotes(
							notes.map((existingNote) =>
								existingNote._id === updatedNote._id
									? updatedNote
									: existingNote
							)
						);
						setNoteToEdit(null);
					}}
				/>
			)}
		</>
	);
};

export default NotesPageLoggedInView;
