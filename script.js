class user{
    constructor(){
    }
}


// everything under this line is Express to make the server run
var express = require("express");
var app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs')

app.get('/secret', isAuthorized, (req,res) => {
    res.json({"message":"This is super secret, do not share!"})
})

app.get('/readme', (req,res) => {
    res.json({"message": "This is open to the world!"})
})

app.get('/jwt',(req,res) => {
    let privateKey = fs.readFileSync('./private.pem','utf8');
    let token = jwt.sign({"body": "stuff"}, privateKey ,{algorithm: 'HS256'});
    res.send(token);
})

function isAuthorized(req, res, next){ // this function gives access with the JWT.
    if (typeof req.headers.authorization !== "undefined"){
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        
        jwt.verify(token, privateKey, {algorithm: 'HS256'}, (err, decoded) => {
            if (err) {
                res.status(500).json({ error:"Not Authorized"});
            }
            console.log(decoded);

            return next();
        });
    } else {
        res.status(500).json({error: "Not Authorized"});
    }
}

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Express app listening at localhost", host, port);
});