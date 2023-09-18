const applyHelmet = require('./helmet');
const applyBodyParser = require('./bodyParser');
const applyMorgan = require('./morgan');
const applyAuth = require('./auth');

module.exports = (app) => {
  applyHelmet(app);
  applyBodyParser(app);
  applyMorgan(app);
  applyAuth(app);
}
