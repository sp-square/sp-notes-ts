import { useState } from 'react';
import { Modal, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { User as UserModel } from '../../models/user';
import { SignUpCredentials } from '../../api/users_api';
import * as UserApi from '../../api/users_api';
import styles from '../../styles/UserModals.module.css';

interface SignUpModalProps {
	onDismiss: () => void;
	onSignUpSuccessful: (user: UserModel) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [validated, setValidated] = useState(false);
	const [errorText, setErrorText] = useState<string | null>(null);

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		switch (name) {
			case 'username':
				setUsername(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
			default:
				break;
		}
	};

	const handleFormSubmit = async (event: any) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}
		setValidated(true);
		try {
			let newUser: UserModel;
			const userInput: SignUpCredentials = {
				username,
				email,
				password,
			};
			newUser = await UserApi.signUp(userInput);
			onSignUpSuccessful(newUser);
		} catch (err) {
			if (err instanceof Error) setErrorText(err.message);
			console.error(err);
		}
	};

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Sign Up</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorText && <Alert variant="danger">{errorText}</Alert>}
				<Form
					id="signUpForm"
					onSubmit={handleFormSubmit}
					noValidate
					validated={validated}
				>
					<Form.Group className="mb-3">
						<Form.Label>Username</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								name="username"
								type="text"
								placeholder="Username"
								value={username}
								onChange={handleChange}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please provide a username
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								name="email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={handleChange}
								required
							></Form.Control>
							<Form.Control.Feedback type="invalid">
								Please provide an email address
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<InputGroup hasValidation>
							<Form.Control
								name="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={handleChange}
								required
							></Form.Control>
							<Form.Control.Feedback type="invalid">
								Please provide a password
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" form="signUpForm" className={styles.width100}>
					Sign Up
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SignUpModal;
