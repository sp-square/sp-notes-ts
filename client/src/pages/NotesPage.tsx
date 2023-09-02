import { User as UserModel } from '../models/user';
import { Container } from 'react-bootstrap';
import NotesPageLoggedInView from './NotesPageLoggedInView';
import NotesPageLoggedOutView from './NotesPageLoggedOutView';
import styles from '../styles/NotesPage.module.css';

interface NotesPageProps {
	loggedInUser: UserModel | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
	return (
		<Container className={styles.notesPage}>
			<>
				{loggedInUser ? <NotesPageLoggedInView /> : <NotesPageLoggedOutView />}
			</>
		</Container>
	);
};

export default NotesPage;
