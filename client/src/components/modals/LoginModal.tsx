import { useState } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { User as UserModel } from '../../models/user';
import { LoginCredentials } from '../../api/users_api';
import * as UserApi from '../../api/users_api';
import styles from '../../styles/UserModals.module.css';

interface LoginModalProps {
	onDismiss: () => void;
	onLoginSuccessful: (user: UserModel) => void;
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [validated, setValidated] = useState(false);

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		switch (name) {
			case 'username':
				setUsername(value);
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
			let currentUser: UserModel;
			const userInput: LoginCredentials = {
				username,
				password,
			};

			currentUser = await UserApi.login(userInput);
			onLoginSuccessful(currentUser);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					id="loginForm"
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
				<Button type="submit" form="loginForm" className={styles.width100}>
					Login
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LoginModal;
