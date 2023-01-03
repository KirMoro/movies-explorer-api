import { Router } from 'express';
import { getUserById, updateUserProfile } from '../controllers/users.js';
import { celebrateProfile } from '../validators/users.js';

export const userRoutes = Router();

userRoutes.get('/me', getUserById);
userRoutes.patch('/me', celebrateProfile, updateUserProfile);
