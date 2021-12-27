const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Пожалуйста, укажите своё имя.'],
    minlength: [2, 'Имя должно содержать больше одного символа'],
    validate: {
      validator: function (el) {
        //return el.includes('abcdefghijklmnopqrstuvwxyz'.split(''));
        const elArr = el.toLowerCase().split('');
        const alfabet =
          'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const alfabetArr = alfabet.split('');
        for (let i = 0; i < alfabetArr.length; i += 1) {
          const found = elArr.find((item) => item === alfabetArr[i]);
          if (found) {
            return true;
          }
        }
        return false;
      },
      message: 'Имя не содержит букв!',
    },
  },
  email: {
    type: String,
    required: [true, 'Пожалуйста, укажите e-mail.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Пожалуйста, укажите корректный e-mail.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Пожалуйста, укажите пароль.'],
    minlength: [8, 'Пароль должен быть длиннее 8 символов.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Пожалуйста, подтвердите свой пароль.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Пароли не совпадают!',
    },
  },
  historyOfMoves: {
    type: Array,
    default: [],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  dataBasePassword
) {
  return await bcrypt.compare(candidatePassword, dataBasePassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
