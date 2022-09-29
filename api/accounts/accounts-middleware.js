const Accounts = require('./accounts-model.js');
const db = require('../../data/db-config.js');

exports.checkAccountPayload = (req, res, next) => {
  if (req.body.name === undefined || req.body.budget === undefined) {
    res.status(400).json({ message: 'name and budget are required' });
  } else if (
    req?.body?.name?.trim().length < 3 ||
    req?.body?.name?.trim().length > 100
  ) {
    res
      .status(400)
      .json({ message: 'name of account must be between 3 and 100' });
  } else if (isNaN(req?.body?.budget)) {
    res.status(400).json('budget of account must be a number');
  } else if (req?.body?.budget < 0 || req?.body?.budget > 1000000) {
    res
      .status(400)
      .json({ message: 'budget of account is too large or too small' });
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  const exists = await db('accounts').where('name', req?.body?.name?.trim());
  if (exists.length) {
    res.status(400).json({ message: 'that name is taken' });
  } else {
    next();
  }
};

exports.checkAccountId = async (req, res, next) => {
  const exists = await Accounts.getById(req?.params?.id);
  if (!exists) {
    res.status(404).json({ message: 'account not found' });
  } else {
    next();
  }
};
