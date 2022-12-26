import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z\0-9]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/;
const emailRegex = /^.+@.+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: (email) => emailRegex.test(email),
      message: () => 'Введите корректный email',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((document) => {
      if (!document) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, document.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const user = document.toObject();
          delete user.password;
          return user;
        });
    });
};

export const Users = mongoose.model('user', userSchema);
