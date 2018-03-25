const express = require('express');
const app = express();
const Stitch = require('mongodb-stitch');
const exphbs = require('express-handlebars');
let appId = 'hack-a-box-obkyj';

const clientPromise = Stitch.StitchClientFactory.create('hack-a-box-obkyj');
clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('Hackabull');
    console.log("connected to mongo");
});
app.engine('handlebars', exphbs.create({}).engine)
app.set('view engine', 'handlebars');

app.post('/sendCode', (req, res) => {
    let jsCode = req.body[0];


});

app.get('/', (req, res) => {
    res.render('home', {layout:false});
});

app.listen(3000);
