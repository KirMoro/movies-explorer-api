import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../models/users.js';

export const celebrateBodyMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).required(),
    director: Joi.string().min(2).required(),
    duration: Joi.number().min(2).required(),
    year: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    image: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    trailerLink: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    thumbnail: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    movieId: Joi.number().min(1).required(),
    nameRU: Joi.string().min(2).required(),
    nameEN: Joi.string().min(2).required(),
  }),
});

export const celebrateMovieId = celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }).required(),
});
