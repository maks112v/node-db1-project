const router = require('express').Router();
const Accounts = require('./accounts-model.js');
const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
} = require('./accounts-middleware.js');

router.get('/', async (req, res, next) => {
  const accounts = await Accounts.getAll();
  return res.status(200).json(accounts);
});

router.get('/:id', checkAccountId, async (req, res, next) => {
  const account = await Accounts.getById(req.params.id);
  return res.status(200).json(account);
});

router.post(
  '/',
  checkAccountPayload,
  checkAccountNameUnique,
  async (req, res, next) => {
    const createAccount = await Accounts.create({
      name: req?.body?.name?.trim(),
      budget: req?.body?.budget,
    });
    return res.status(201).json(createAccount);
  }
);

router.put(
  '/:id',
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
  async (req, res, next) => {
    const update = await Accounts.updateById(req.params.id, req.body);
    return res.status(200).json(update);
  }
);

router.delete('/:id', checkAccountId, async (req, res, next) => {
  await Accounts.deleteById(req.params.id);
  return res.status(200).json({ message: 'account deleted' });
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // DO YOUR MAGIC
});

module.exports = router;
