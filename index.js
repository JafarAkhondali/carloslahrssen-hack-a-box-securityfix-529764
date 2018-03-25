const express = require('express');
const app = express();
const Stitch = require('mongodb-stitch');
const exphbs = require('express-handlebars');
const FormData = require('form-data');
const axios = require('axios');
let appId = 'hack-a-box-obkyj';

const clientPromise = Stitch.StitchClientFactory.create('hack-a-box-obkyj');
app.use(express.static('views'));

let boxes;
let users;
let questions;
let s3;

clientPromise
    .then(client => {
        const db = client.service('mongodb', 'mongodb-atlas').db('Hackabull');
        s3 = client.service("aws-s3","hack-a-box");
        console.log(s3);
        client.login()
            .then(()=> {
                boxes = db.collection('boxes');
                users = db.collection('users');
                questions = db.collection('questions');
            })
    });


app.engine('handlebars', exphbs.create({}).engine)
app.set('view engine', 'handlebars');

app.post('/sendCode', (req, res) => {

});

app.get('/getUser', (req, res)=>{
    users.findOne({"token": "testSix"})
        .then((doc) => {
            return doc;
        });
});

app.get('/createBox', (req, res) => {
    let boxurl = req

    boxes.insertOne({boxUrl: "google.com", question: [0,1,2], isClaimed:false, s3Link: "jabroni.com"})
        .then((docs)=>{console.log(docs)});
});

app.get('/createUser', (req, res) => {
    users.insertOne({name:"carlos", email: "carloslahrssen@hotmail", token:"testSix", workingBoxes:{id:"", questionNumber:0}})
        .then((docs)=>{console.log(docs)});
});

app.get('/getChallenge', (req, res) => {
   //users->workingBoxId return find box id question 
    //else update the user with a new working box id and return first question
    //return question and description
    //let token = req.body[1];
    //let boxId = req.body[0];
    
    users.findOne({"token":"testSix"})
        .then(user => {
            console.log(user);
            if(!user.workingBoxes.id)
            {
                users.updateOne({"_id":user._id}, { $set: 
                    {
                        "workingBoxes":{
                            "id":"boxId",
                            "questionNumber":1
                        } 
                        
                    }
                })
                .then((doc) => {
                    console.log(doc);
                })
                console.log(user.name);
            }
            else
            {
                users.updateOne({"_id":user._id}, {$set:
                    {
                        "workingBoxes":
                        {
                            "id":"boxId",
                            "questionNumber":user.workingBoxes.questionNumber++
                        }
                    }
                })
                .then((doc)=>{
                    console.log(doc);
                })
            }
        })

});


app.get('/getQuestions', (req, res) => {
    questions.findOne({questionNumber:1})
        .then((doc) => {
            console.log(doc);
        });
});



app.get('/postPicture', (req, res) => {
    s3.put({
        "bucket": "hack-a-box",
        "key": "test",
        "contentType":"text/plain" ,
        "acl": "public-read",
        "body": "hello world"
    });
});

app.get('/getBox', (req, res) => {
    boxes.find({}).limit(3).execute()
        .then(docs => {
            console.log(docs);
            return docs
        });
});

app.get('/comparePhoto', () => {

    let formData = new FormData();
    let urler = 'http://fa6f1732.ngrok.io';

    axios(urler, {
    method: 'GET',
    }).then(function(response) {
        console.log('response::', response.data);
        let imagefileString = response.data;
        let imagefile = new Buffer(imagefileString, 'base64');

        return imagefile;
    })
    .then((imagefile) => {
        formData.append("image", imagefile);
    })
    .then(() => {
        url = 'https://mixtape.moe/upload.php';
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {console.log(response)})
    });

});

app.get('/', (req, res) => {
    res.render('index', {layout:false});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(3000);
