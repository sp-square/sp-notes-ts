import { User } from '../models/user';
import { fetchData } from '../utils/fetchData';

export async function getLoggedInUser(): Promise<User> {
	const response = await fetchData('/api/users/', { method: 'GET' });
	const loggedInUser = await response.json();
	return loggedInUser;
}

export interface SignUpCredentials {
	username: string;
	email: string;
	password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
	const response = await fetchData('/api/users/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials),
	});
	const signedUpUser = await response.json();
	console.log('signedUpUser', signedUpUser);
	return signedUpUser;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
	const response = await fetchData('/api/users/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials),
	});
	const loggedInUser = await response.json();
	return loggedInUser;
}

export async function logout() {
	await fetchData('/api/users/logout', { method: 'POST' });
}
