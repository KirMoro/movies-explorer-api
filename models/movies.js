import mongoose from 'mongoose';
import { urlRegex } from './users.js';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minLength: 2,
  },
  director: {
    type: String,
    required: true,
    minLength: 2,
  },
  duration: {
    type: Number,
    required: true,
    minLength: 2,
  },
  year: {
    type: String,
    required: true,
    minLength: 2,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlRegex.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlRegex.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlRegex.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    minLength: 1,
  },
  nameRU: {
    type: String,
    required: true,
    minLength: 2,
  },
  nameEN: {
    type: String,
    required: true,
    minLength: 2,
  },
}, { versionKey: false });

export const Movies = mongoose.model('movie', movieSchema);
