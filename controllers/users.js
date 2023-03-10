import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { constants } from 'http2';
import { Users } from '../models/users.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ServerError } from '../errors/ServerError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SALT } = req.app.get('config');

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      } else {
        const token = jwt.sign(
          { _id: user._id },
          JWT_SALT,
          { expiresIn: '7d' },
        );
        res.send({ token });
      }
    })
    .catch(next);
};

export const getUserById = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.status(constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;

      return Users.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...fields } = document.toObject();
      res.status(constants.HTTP_STATUS_OK).send(fields);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.status(constants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new ServerError(err.message));
      }
    });
};
