const express = require('express');
const config = require('./config');
const logger = require('./services/logger');
const auth = require('./middleware/auth');
const bodyParsers = require('./middleware/bodyParsers');

const Episode = require('./models/Episode');

const app = express();
app.disable('x-powered-by');

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/buckets/:id', (req, res) => {
  res.send(Episode.getAll(req.params.id));
});

app.post('/buckets/:id', auth.requireToken, ...bodyParsers, (req, res) => {
  const result = Episode.update(req.params.id, req.body);
  return res.json(result);
});

app.get('/buckets/:id/save', auth.requireToken, async (req, res) => {
  const result = await Episode.save(req.params.id);
  return res.json(result);
});

const listener = app.listen(config.port, () => {
  logger.info(`Listening on port ${listener.address().port}!`);
});
