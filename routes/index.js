import { Router } from 'express';
import { celebrateBodyUser, celebrateLoginUser } from '../validators/users.js';
import { createUser, login } from '../controllers/users.js';
import { auth } from '../middlewares/auth.js';
import { userRoutes } from './users.js';
import { movieRoutes } from './movies.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const router = Router();

router.post('/signup', celebrateBodyUser, createUser);
router.post('/signin', celebrateLoginUser, login);
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.all('/*', (req, res, next) => next(new NotFoundError('Запрошена несуществующая страница')));
