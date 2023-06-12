import { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { Note } from '../models/note';
import { NoteInput } from '../api/notes_api';
import * as NotesApi from '../api/notes_api';

interface AddNoteModalProps {
	onDismiss: () => void;
	onNoteSaved: (note: Note) => void;
}

const AddNoteModal = ({ onDismiss, onNoteSaved }: AddNoteModalProps) => {
	const [noteTitle, setNoteTitle] = useState('');
	const [noteTopic, setNoteTopic] = useState('');
	const [noteText, setNoteText] = useState('');
	const [validated, setValidated] = useState(false);

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		switch (name) {
			case 'noteTitle':
				setNoteTitle(value);
				break;
			case 'noteTopic':
				setNoteTopic(value);
				break;
			case 'noteText':
				setNoteText(value);
				break;
			default:
				break;
		}
	};

	const handleFormSubmit = async (event: any) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}
		setValidated(true);
		try {
			let noteResponse: Note;
			const noteInput: NoteInput = {
				title: noteTitle,
				topic: noteTopic,
				text: noteText,
			};
			noteResponse = await NotesApi.createNote(noteInput);
			onNoteSaved(noteResponse);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header>
				<Modal.Title>AddNote</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					id="addNoteForm"
					onSubmit={handleFormSubmit}
					noValidate
					validated={validated}
				>
					<Form.Group className="mb-3">
						<Form.Label>Title</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								name="noteTitle"
								type="text"
								placeholder="Title"
								value={noteTitle}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a title
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Topic</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								name="noteTopic"
								type="text"
								placeholder="Topic"
								value={noteTopic}
								onChange={handleChange}
								required
							></Form.Control>
							<Form.Control.Feedback type="invalid">
								Please provide a topic
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Text</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							name="noteText"
							placeholder="Text"
							value={noteText}
							onChange={handleChange}
						></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" form="addNoteForm">
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddNoteModal;
