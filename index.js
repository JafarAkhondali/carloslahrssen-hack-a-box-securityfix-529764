const express = require('express');
const app = express();
const Stitch = require('mongodb-stitch');
let appId = 'hack-a-box-obkyj';

Stitch.StitchClientFactory.create(appId)
    .then(client => {
        const db = client.service('mongodb', 'mongodb-atlas').db('Hackabull');
        client.login().then(() =>
            db.collection('Hackabox').find({}).limit(100).execute()
                .then(docs => {
                    console.log(docs);
                })
    )});


app.get('/', (req, res) => {
    console.log("fuck we here");
});

app.listen(3000, ()=>{
    console.log('listening');
});
