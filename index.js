const express = require('express');
const app = express();



app.get('/', (req, res) => {
    console.log("fuck we here");
}):

app.listen(3000, ()=>{
    console.log('listening');
});
