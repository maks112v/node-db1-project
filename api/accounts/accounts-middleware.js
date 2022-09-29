const Accounts = require('./accounts-model.js');
const db = require('../../data/db-config.js');
const Yup = require('yup');

const payloadSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('name and budget are required')
    .min(3, 'name of account must be between 3 and 100')
    .max(100, 'name of account must be between 3 and 100'),
  budget: Yup.number()
    .typeError('must be a number')
    .required('name and budget are required')
    .min(0, 'budget of account is too large or too small')
    .max(1000000, 'budget of account is too large or too small'),
});

exports.checkAccountPayload = async (req, res, next) => {
  payloadSchema
    .validate(req.body)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
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
