import express from 'express';
import { requiresAuth } from '../util/auth';
import {
	getAuthenticatedUser,
	signUp,
	login,
	logout,
} from '../controllers/users';

const router = express.Router();

router.get('/', requiresAuth, getAuthenticatedUser);

router.post('/signup', signUp);

router.post('/login', login);

router.post('/logout', logout);

export default router;
