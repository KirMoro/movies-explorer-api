import mongoose from 'mongoose';
import { urlRegex } from './users.js';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const Movies = mongoose.model('movie', movieSchema);
