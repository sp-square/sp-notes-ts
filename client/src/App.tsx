import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { User as UserModel } from './models/user';
import * as UserApi from './api/users_api';
import NavBar from './components/navigation/NavBar';
import LoginModal from './components/modals/LoginModal';
import SignUpModal from './components/modals/SignUpModal';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './styles/App.module.css';

function App() {
	const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await UserApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (err) {
				console.error(err);
			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<BrowserRouter>
			<div className="bg">
				<NavBar
					loggedInUser={loggedInUser}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLoginClicked={() => setShowLoginModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path="/"
							element={<NotesPage loggedInUser={loggedInUser} />}
						/>
						<Route path="/privacy" element={<PrivacyPage />} />
						<Route path="/*" element={<NotFoundPage />} />
					</Routes>
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
		</BrowserRouter>
	);
}

export default App;
