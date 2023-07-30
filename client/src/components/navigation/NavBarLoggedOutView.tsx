import { Button } from 'react-bootstrap';

interface NavBarLoggoutInViewProps {
	onSignUpClicked: () => void;
	onLoginClicked: () => void;
}

const NavBarLoggedOutView = ({
	onSignUpClicked,
	onLoginClicked,
}: NavBarLoggoutInViewProps) => {
	return (
		<>
			<Button onClick={onSignUpClicked}>Sign Up</Button>
			<Button onClick={onLoginClicked}>Login</Button>
		</>
	);
};

export default NavBarLoggedOutView;
