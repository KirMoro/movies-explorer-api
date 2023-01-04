import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../models/users.js';

export const celebrateBodyMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    trailerLink: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    thumbnail: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

export const celebrateMovieId = celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }).required(),
});
