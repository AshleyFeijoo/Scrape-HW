// Grab the articles as a json

$("#scrapeBtn").click(function (e) { 
  e.preventDefault();
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        "<div class='col-md-12 mb-2 p-1'><h2 data-id='"
        + data[i]._id + "'>" 
        + data[i].title 
        + "<br/></h2>" 
        + "<img width=280; src ='" + data[i].img + "'>"
        + "<h4><a target='_blank' href='" + data[i].link + "'>Read More...</a></h4>"+
        "<a class='btn-floating btn-lg btn-default' id='commentBtn'><i class='white-text fal fa-comment-plus'></i></a></div>");
    }
  });
});

$("#clearBtn").click(function (e) { 
  e.preventDefault();
  $('#articles').empty();

  
});

// Whenever someone clicks a p tag
$(document).on("click", "#commentBtn", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $("#commentBtn").siblings("h2").attr('data-id')
  console.log(thisId);
//   var thisId = $(this).attr("data-id");
// console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2 class='col-md-12'>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<div class='col-md-12 text-left mx-auto'><label for='titleinput'>Name:</label></div><div class='col-12'><input id='titleinput' class='col-12' name='title' ></div>");
      // A textarea to add a new note body
      $("#notes").append(`<div class='col-md-12 text-left'><label for="bodyinput">Add Comment:</label>
      <textarea id='bodyinput' name='body'></textarea></div>`);
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<div class='col-md-12'><button data-id='" + data._id + "' id='savenote'>Save Note</button></div>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
