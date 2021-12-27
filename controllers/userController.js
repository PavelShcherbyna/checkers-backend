const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Пользователь с данным id не найден.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// функция записи истории ходов в БД. req.user.id берётся из мидлвара protect,
// в req.body нужно передавать только массив с историей ходов
exports.saveMyHistory = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {},
  });
});
