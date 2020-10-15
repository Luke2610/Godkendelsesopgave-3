
class user{ // class user
    constructor(firstName, lastName, age, gender, interest, match,image){
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.interest = interest;
    this.match = match;
    this.image = image;
    }
}
// class paymentUser with inheritance from class user
class paymentUser extends user{
    constructor(firstName,lastName,age,gender,interest,match, image,creditCard) {
        super(firstName,lastName,age,gender,interest,match, image)
        this.creditCard = creditCard;
    }
}

// class freeUser with inheritance from class user
class freeUser extends user{
    constructor(firstName,lastName,age,gender,interest,match,image, creditCard) {
        super(firstName,lastName,age,gender,interest,match,image)
        this.creditCard = creditCard;
    }
}

// the users
var kasper = new paymentUser("Kasper","Jakobsen","21","male",["Gaming","Food","Scout"],22, true,true);
var eva = new freeUser("Eva","Hansen","20","female", ["Communism","Fishing","Diving"],3,true,false);
var users = [kasper]; // user eva can be added to this with a http post later on

// everything under this line is the server stuff
var express = require("express");
var app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');

// username and password login
username = "username"; password = "password" // the most secure login :)
if (username == "username" && password == "password"){ // if username and password matches, you are able to recieve the JWT token
app.get('/jwt',(req,res) => {
    let privateKey = fs.readFileSync('./private.pem','utf8');
    let token = jwt.sign({"Authorization": "Authorized"}, privateKey ,{algorithm: 'HS256'});
    res.send(token);
})} else {
    app.get('/jwt',(req,res) =>{
        res.send("Access Denied")
    })
};

//CRUD-Endpoints for User, Interest & Match.

//User-endpoint
// read
app.get('/user', (req,res) => {
    res.status(200).json(users)
});

// create
app.post('/user', (req,res) => {
    users.push(eva);
    res.status(201).json(eva);
});

// update
app.put('/user', (req,res) => {
    eva.firstName = "Susanne"
    eva.image = true;
    res.status(204).json(eva)
});

// delete
app.delete('/user',(req,res) => {
    users.splice(1,1);
    res.status(204).json(eva);
});

//Interest-endpoint
// read
app.get('/interest', (req,res) => {
    res.send("Kaspers interests are: " + kasper.interest);
});

// create
app.post('/interest', (req,res) => {
    newInterest = "Running";
    kasper.interest.push(newInterest);
    res.status(201).json(newInterest);
});

// update
app.put('/interest', function (req, res) {
    updatedInterest = "Jumping";
    kasper.interest.splice(3,1,updatedInterest)
    res.sendStatus(204)
});

// delete
app.delete('/interest', (req,res) => {
    kasper.interest.splice(2,1)
    res.sendStatus(204);
});

//Match-endpoint
// read
app.get('/match', isAuthorized, (req,res) => { // to see matches you have to be authorized
    res.send("Kaspers number of matches: " + kasper.match);
});

// create
app.post('/match', isAuthorized, (req,res) => {
    newMatches = 32; // new number of matches
    kasper.match = newMatches;
    res.status(201).json(newMatches);
});

// update
app.put('/match', isAuthorized, function (req, res) {
    newMatches = 12; // new matches
    kasper.match = kasper.match + newMatches; //current matches + new matches
    res.sendStatus(204);
});

// delete
app.delete('/match', isAuthorized, (req,res) => {
    kasper.match = 0;
    res.sendStatus(204);
});


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
};

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log("Express app listening at localhost:", port);
});