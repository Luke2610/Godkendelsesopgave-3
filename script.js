class user{
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

class paymentUser extends user{
    constructor(firstName,lastName,age,gender,interest,match, image,creditCard) {
        super(firstName,lastName,age,gender,interest,match, image)
        this.creditCard = creditCard;
    }
}

class freeUser extends user{
        constructor(firstName,lastName,age,gender,interest,match,image, creditCard) {
            super(firstName,lastName,age,gender,interest,match,image)
            this.creditCard = creditCard;
    }
}

var kasper = new paymentUser("Kasper","Jakobsen","21","male","female",22, true,true);
console.log(kasper)

var eva = new freeUser("Eva","Hansen","20","female", "male",3,true,false)
console.log(eva)



// everything under this line is Express to make the server run
var express = require("express");
var app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { stringify } = require("querystring");

app.get('/secret', isAuthorized, (req,res) => {
    res.json({"message":"This is super secret, do not share!" + stringify(kasper)})
})

app.get('/readme', (req,res) => {
    res.json({"message": "This is open to the world!" + JSON.stringify(kasper)})
})
app.get('/jwt',(req,res) => {
    let privateKey = fs.readFileSync('./private.pem','utf8');
    let token = jwt.sign({"body": "stuff"}, privateKey ,{algorithm: 'HS256'});
    res.send(token);
})

//CRUD-Endpoints for User, Interest & Match.

//User-endpoint
app.get('/user', (req,res) => {
    res.json(kasper);
})

//Interest-endpoint
app.get('/interest', (req,res) => {
    res.json(kasper.interest);
})

//Match-endpoint
app.get('/match', (req,res) => {
    res.json("Number of matches: " + kasper.match);
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