const express = require('express');
const app = express();
const Stitch = require('mongodb-stitch');
const exphbs = require('express-handlebars');
let appId = 'hack-a-box-obkyj';

const clientPromise = Stitch.StitchClientFactory.create('hack-a-box-obkyj');

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
            console.log(doc);
        });
});

app.get('/createBox', (req, res) => {
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

app.post('/createQuestions', (req, res) => {
    questions.insertOne({});
});

app.get('/getQuestions', (req, res) => {
    questions.findOne({questionNumber:1})
        .then((doc) => {
            console.log(doc);
        });
});

app.post('/signIn', (req,res) => {
    let user = req.body[0];
    //if token exists then update user object,
    users.insertOne({user})
        .then((docs) => console.log(docs));
});

app.get('/validateChallenge', (req, res) => {
    //return true or false, if true alter boxes
    //eval req.body.textField
    let solution = req.body[0];
    let questionNumber = 1;
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
    boxes.findOne({'boxUrl':'google.com'})
        .then(docs => {
            return docs
        });
});

app.get('/', (req, res) => {
    res.render('home', {layout:false});
});

app.listen(3000);
