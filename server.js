var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
// app.use(express.static("./public"));
app.use(express.static(__dirname + '/public'));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB

// mongoose.connect("mongodb://heroku_2sqt21rx:6dgrp89eh23jv1isi8vhebronc@ds239797.mlab.com:39797/heroku_2sqt21rx", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeHwDb";
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true });
var result = {};
// Routes

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.clickhole.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    console.log($);
    $("article").each(function(i, element) {
    
      var title = $(element).find("h1").text();
      var link = $(element).find("h1").parent("a").attr("href");
      var img = '';
      // console.log(link);
      axios.get(link).then(function(response) {
        var $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
          img = $(element).find("img").attr("src");
            // console.group(image);
        })
        const result ={
          title: title,
          link: link,
          img: img
        };
        db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);

        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log("error is " + err);
        });
      // db.scrapedData.save( results );

      });

    });
  
    // Send a message to the client
    res.redirect('/');
    
  });
  // res.redirect('/');
      // res.send(result);
});


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle._id);
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.get("/notes/:authorids", function(req, res){
console.log(req.params.articleId);
  db.Note.findOne({authorids: req.params.id})
    .then(function(dbNote) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // db.Note.findOne(articleId: )
      // If we were able to successfully find an Article with the given id, send it back to the client
     
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log(req.params);
      // req.params
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // db.Article.insertMany({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      // console.log(dbNote)
    })
    .then(function(dbArticle) {

      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      console.log(dbArticle)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
