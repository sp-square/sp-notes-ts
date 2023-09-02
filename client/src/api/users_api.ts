import { User } from '../models/user';
import { fetchData } from '../utils/fetchData';

export async function getLoggedInUser(): Promise<User> {
	const response = await fetchData('/api/users/', { method: 'GET' });
	if (!response.ok) {
		throw new Error(`Request failed with status code ${response.status}.`);
	}
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
	if (!response.ok) {
		throw new Error(`Request failed with status code ${response.status}.`);
	}
	const signedUpUser = await response.json();
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
	if (!response.ok) {
		throw new Error(`Request failed with status code ${response.status}.`);
	}
	const loggedInUser = await response.json();
	return loggedInUser;
}

export async function logout() {
	await fetchData('/api/users/logout', { method: 'POST' });
}
