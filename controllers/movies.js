import { constants } from 'http2';
import { Movies } from '../models/movies.js';
import { ServerError } from '../errors/ServerError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

export const getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => {
      const userMovies = [];
      movies.forEach((movie) => {
        if (movie.owner.toString() === req.user._id) {
          userMovies.push(movie);
        }
      });
      res.send(userMovies);
    })
    .catch(next);
};

export const createMovie = (req, res, next) => {
  Movies.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(constants.HTTP_STATUS_OK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      } else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Отсутствуют права доступа.');
      } else {
        return Movies.findByIdAndRemove(req.params.movieId);
      }
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления фильма.'));
      } else {
        next(err);
      }
    });
};
