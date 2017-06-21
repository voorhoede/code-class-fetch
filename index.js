const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const express = require('express');

const app = express();
const port = process.env.PORT || 33824; // 33824 is "fetch" in T9

let store = {};
const secret = crypto.randomBytes(8).toString('hex');
const myKey = crypto.randomBytes(8).toString('hex');

app.use(bodyParser.json());
app.use(cookieParser(secret));

app.get('/ok/', (req, res) => res.send('🎁'));
app.get('/text/', (req, res) => res.send('text 🎁'));
app.get('/json/', (req, res) => res.json({ item: 'text 🎁' }));
app.get('/store/', (req, res) => res.send(store));
app.post('/store/', (req, res) => {
  store = req.body;
  res.json({ message: 'Store updated' });
});
app.get('/protected/', (req, res) => {
    if (req.signedCookies['key'] === myKey) {
        res.json({ message: 'Congrats, you are authenticated.' });
    } else {
        res.sendStatus(401);
    }
})

app.use((req, res, next) => {
    res.cookie('key', myKey, {signed: true});
    next();
})
app.use(express.static('src'));

app.listen(port, () => console.log(`Demo server available on http://localhost:${port}`));