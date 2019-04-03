const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const configuredKnex = require('../data/dbConfig.js');

module.exports = {
  name: 'cookies',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 10, // milliseconds
    secure: false, // use cookie over https only, in production want to use https only
    httpOnly: true, // false means can JS access the cookie on the client
  },
  resave: false, // avoid recreating unchanged sessions
  saveUninitialized: false, // GDPR compliance
  store: new KnexSessionStore({
    knex: configuredKnex,
    tablename: 'sessions',
    sidfielf: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30, // delete expired sessions
  }),
} 