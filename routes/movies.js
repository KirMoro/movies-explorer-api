import { Router } from 'express';
import {
  getMovies, createMovie, deleteMovie
} from '../controllers/movies.js';
import { celebrateBodyMovie, celebrateMovieId } from '../validators/movies.js';

export const movieRoutes = Router();

movieRoutes.get('/', getMovies);
movieRoutes.post('/', celebrateBodyMovie, createMovie);
movieRoutes.delete('/_id', celebrateMovieId, deleteMovie);
