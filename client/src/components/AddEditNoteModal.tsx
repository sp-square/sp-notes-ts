import { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { Note as NoteModel } from '../models/note';
import { NoteInput } from '../api/notes_api';
import * as NotesApi from '../api/notes_api';

interface AddEditNoteModalProps {
	noteToEdit?: NoteModel;
	onDismiss: () => void;
	onNoteSaved: (note: NoteModel) => void;
}

const AddEditNoteModal = ({
	noteToEdit,
	onDismiss,
	onNoteSaved,
}: AddEditNoteModalProps) => {
	const [noteTitle, setNoteTitle] = useState(`${noteToEdit?.title || ''}`);
	const [noteTopic, setNoteTopic] = useState(`${noteToEdit?.topic || ''}`);
	const [noteText, setNoteText] = useState(`${noteToEdit?.text || ''}`);
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
			let noteResponse: NoteModel;
			const noteInput: NoteInput = {
				title: noteTitle,
				topic: noteTopic,
				text: noteText,
			};
			if (noteToEdit) {
				noteResponse = await NotesApi.updateNote(noteToEdit._id, noteInput);
			} else {
				noteResponse = await NotesApi.createNote(noteInput);
			}
			onNoteSaved(noteResponse);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header>
				<Modal.Title>{noteToEdit ? 'Edit Note' : 'Add Note'}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					id="addEditNoteForm"
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
				<Button type="submit" form="addEditNoteForm">
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddEditNoteModal;
