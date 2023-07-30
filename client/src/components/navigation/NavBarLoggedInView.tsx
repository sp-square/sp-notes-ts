import { Button, Navbar } from 'react-bootstrap';
import * as UserApi from '../../api/users_api';
import { User as UserModel } from '../../models/user';

interface NavBarLoggedInViewProps {
	user: UserModel;
	onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
	user,
	onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
	async function logout() {
		try {
			await UserApi.logout();
			onLogoutSuccessful();
		} catch (err) {
			console.error(err);
			alert(err);
		}
	}
	return (
		<>
			<Navbar.Text className="me-2">Signed in as: {user.username}</Navbar.Text>
			<Button onClick={logout}>Logout</Button>
		</>
	);
};

export default NavBarLoggedInView;
