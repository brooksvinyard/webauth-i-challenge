const express = require('express');
const bcrypt = require('bcryptjs');

const server = express();
server.use(express.json());

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

server.get('/', (req, res) => {
    res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
    let user = req.body;

    // hash the password
    const hash = bcrypt.hashSync(user.password, 4); // for the demo make the number smaller, for production, higher >10
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            // check the password against the database
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// restrict access to this endpoint to only users that provide
// the right credentials in the headers
server.get('/api/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

function restricted(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                // check the password against the database
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: "You shall not pass!!" });
                }
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
        res.status(401).json({ message: "Need credentials" });
    }
}


module.exports = server;
