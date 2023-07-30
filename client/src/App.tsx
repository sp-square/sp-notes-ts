import { Container } from 'react-bootstrap';
import LoginModal from './components/modals/LoginModal';
import SignUpModal from './components/modals/SignUpModal';
import NavBar from './components/navigation/NavBar';
import styles from './styles/NotesPage.module.css';
import { useEffect, useState } from 'react';
import { User as UserModel } from './models/user';
import * as UserApi from './api/users_api';
import NotesPageLoggedInView from './pages/NotesPageLoggedInView';
import NotesPageLoggedOutView from './pages/NotesPageLoggedOutView';

function App() {
	const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	console.log('loggedInUser', loggedInUser);
	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await UserApi.getLoggedInUser();
				console.log('user', user);
				setLoggedInUser(user);
			} catch (err) {
				console.error(err);
			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<div className="bg">
			<NavBar
				loggedInUser={loggedInUser}
				onSignUpClicked={() => setShowSignUpModal(true)}
				onLoginClicked={() => setShowLoginModal(true)}
				onLogoutSuccessful={() => setLoggedInUser(null)}
			/>
			<Container className={styles.notesPage}>
				<>
					{loggedInUser ? (
						<NotesPageLoggedInView />
					) : (
						<NotesPageLoggedOutView />
					)}
				</>
			</Container>
			{showSignUpModal && (
				<SignUpModal
					onDismiss={() => setShowSignUpModal(false)}
					onSignUpSuccessful={(user) => {
						setLoggedInUser(user);
						setShowSignUpModal(false);
					}}
				/>
			)}
			{showLoginModal && (
				<LoginModal
					onDismiss={() => setShowLoginModal(false)}
					onLoginSuccessful={(user) => {
						console.log('user onLoginSuccessful', user);
						setLoggedInUser(user);
						setShowLoginModal(false);
					}}
				/>
			)}
		</div>
	);
}

export default App;
