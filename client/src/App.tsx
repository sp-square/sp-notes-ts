import { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import * as NotesApi from './api/notes_api';
import Note from './components/Note';
import AddNoteModal from './components/AddNoteModal';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import styles from './styles/NotesPage.module.css';

function App() {
	const [notes, setNotes] = useState<NoteModel[]>([]);
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);

	useEffect(() => {
		async function loadNotes() {
			try {
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (err) {
				console.error(err);
				alert(err);
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
		<div className="bg">
			<Container>
				<Button
					className={`mb-4 w-100 ${styles.addButton}`}
					variant="dark"
					onClick={() => setShowAddNoteModal(true)}
				>
					<FaPlus className="text-warning" />
					Add new note
				</Button>
				<Row xs={1} md={2} xl={3} className="g-4">
					{notes.map((note) => (
						<Col key={note._id}>
							<Note
								note={note}
								className={styles.note}
								onDeleteNote={deleteNote}
							></Note>
						</Col>
					))}
				</Row>
				{showAddNoteModal && (
					<AddNoteModal
						onDismiss={() => setShowAddNoteModal(false)}
						onNoteSaved={(newNote) => {
							setNotes([...notes, newNote]);
							setShowAddNoteModal(false);
						}}
					/>
				)}
			</Container>
		</div>
	);
}

export default App;
