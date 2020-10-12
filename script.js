class user{
    constructor(){
    }
}


// everything under this line is Express to make the server run
// this line allows us to use the expressjs module
var express = require("express");

// Add this line so we can serve files from our local
// directory
var path = require("path");
var app = express();

// Add the abillity to serve our static files from the public directory
app.use(express.static("public"));

// Here we serve up our index page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("GadgetEdge.net listening at http://%s:%s", host, port);
});