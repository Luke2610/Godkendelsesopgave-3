
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
console.log(kasper)

var eva = new freeUser("Eva","Hansen","20","female", ["Communism","Fishing",""],3,true,false)
console.log(eva)



// everything under this line is the server stuff
var express = require("express");
var app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');

app.get('/secret', isAuthorized, (req,res) => {
    res.json({"message":"This is super secret, do not share!"})
})

app.get('/jwt',(req,res) => {
    let privateKey = fs.readFileSync('./private.pem','utf8');
    let token = jwt.sign({"Authorization": "Authorized"}, privateKey ,{algorithm: 'HS256'});
    res.send(token);
})

//CRUD-Endpoints for User, Interest & Match.

//User-endpoint
app.get('/user', (req,res) => {
    res.status(200).json(kasper)
    console.log(req.body) //logging the forms from the HTML
})

//Interest-endpoint
// Read
app.get('/interest', (req,res) => {
    res.send("Kaspers interests are: " + kasper.interest);
});

// create new interest for user (I use Postman to do the post request)
app.post('/interest', (req,res) => {
    newInterest = "Running";
    kasper.interest.push(newInterest);
    res.status(201).json(newInterest);
});

app.put('/interest', function (req, res) {
    updatedInterest = "Jumping";
    kasper.interest.splice(3,1,updatedInterest)
    res.sendStatus(204)
});

app.delete('/interest', (req,res) => {
    kasper.interest.splice(2,1)
    res.sendStatus(204);
})

//Match-endpoint
app.get('/match', (req,res) => {
    res.send("Kaspers number of matches: " + kasper.match);
})

app.post('/match', (req,res) => {
    newMatches = 32; // new number of matches
    kasper.match = newMatches;
    res.status(201).json(newMatches);
});

app.put('/match', function (req, res) {
    newMatches = 12; // new matches
    kasper.match = kasper.match + newMatches; //current matches + new matches
    res.sendStatus(204);
});

app.delete('/match', (req,res) => {
    kasper.match = 0;
    res.sendStatus(204);
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
  var port = server.address().port;
  console.log("Express app listening at localhost", port);
});