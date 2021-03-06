$(document).ready(function () {
  $("#commentz").hide();

  $.ajax({
    method: "GET",
    url: "/"
  })
    // With that done, add the note information to the page
    .then(function(data) {})

$("#scrapeBtn").click(function (e) { 
  e.preventDefault();
  $.getJSON("/articles", function(data) {
    console.log(data);
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
        "<button data-toggle='modal' data-target='#basicExampleModal' class='btn-floating btn-lg btn-indigo' id='commentBtn'><i class='white-text fal fa-comment-plus'></i></button></div>");
    }
  
  });
});

$(document).on("click", "#listCommentBtn", function(e) {
  $("#commentz").show();
  var newId = $(this).attr("data-id");
  console.log("data id=" + newId)
  e.preventDefault();
  $.ajax({
    method: "GET",
    url: "/articles/"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      for (let i=0; i<data.length; i++){
        // if (data[i].note){
          console.log(data[i])
        // }
      }
      // $("#noteComments").empty();

    });
})


$("#clearBtn").click(function (e) { 
  e.preventDefault();
  $('#articles').empty();
  $("#notes").empty();

  
});

// Whenever someone clicks a p tag
$(document).on("click", "#commentBtn", function(e) {
  $("#commentz").show();
  e.preventDefault();
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).siblings("h2").attr('data-id');
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

      // $("#noteComments").empty();
      console.log("DATA" + data);
      // The title of the article
      $("#notes").append("<h2 class='col-md-12'>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<div class='col-md-12 text-left mx-auto'><label for='titleinput'>Name:</label></div><div class='col-12'><input id='titleinput' class='col-12' name='title' ></div>");
      // A textarea to add a new note body
      $("#notes").append(`<div class='col-md-12 text-left'><label for="bodyinput">Add Comment:</label>
      <textarea id='bodyinput' name='body'></textarea></div>`);
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<div class='col-md-12'><button class='btn btn-primary btn-rounded 'data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button></div>");
      $("#notes").append("<hr/><div class='border border-primary col-md-12'></div>");
      // if (data.note) {
        
      //   // Place the title of the note in the title input
      //   var noteTitle=data.note.title;
      //   // Place the body of the note in the body textarea
      //   var noteBody=data.note.body;
      //   console.log(noteTitle);
      //   $("#noteComments").append('<div class="col-md-12"><h3 class="h3 text-muted text-left mt-4">Comments:</h3></div><div class="text-left col-md-12 p-2 grey"><div class="text-left col-md-12"><h4 class="h4">' +  noteTitle +'<h4> </div><div class="col-md-12"><h6 class="h6">' +  noteBody +'<h6> </div></div>');

      // }else{
      //   $("#noteComments").empty();
      //   $("#noteComments").append('<div class="col-md-12"><h6 class="h6">NO NOTES YET<h6> </div>');

      // }
    });
});

$("#delBtn").click(function (e) { 
  e.preventDefault();
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  
});

$(document).on("click", "#savenote", function(e) {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  
  if ($("#titleinput").val() && $("#bodyinput").val() ){
  // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        articleids: thisId,
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val(),
      }
    })
      // With that done
      .then(function(data) {
        console.log(data._id);
        
        $.ajax({
          method: "GET",
          url: "/articles/" + thisId
        })
          // With that done, add the note information to the page
          .then(function(data) {
            for (let i=0; i<data.length; i++){
            // $("#noteComments").empty();
            // The title of the article
            $("#notes").append("<h2 class='col-md-12'>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<div class='col-md-12 text-left mx-auto'><label for='titleinput'>Name:</label></div><div class='col-12'><input id='titleinput' class='col-12' name='title' ></div>");
            // A textarea to add a new note body
            $("#notes").append(`<div class='col-md-12 text-left'><label for="bodyinput">Add Comment:</label>
            <textarea id='bodyinput' name='body'></textarea></div>`);
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<div class='col-md-12'><button class='btn btn-primary btn-rounded 'data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button></div>");
            $("#notes").append("<hr/><div class='border border-primary col-md-12'></div>");
        
            $("#notes").append('<div class="row"><h3 class="h3 text-muted text-left mt-4">Comments:</h3></div>');
            }
            console.log(data.note);
            if (data.note) {

              console.log(data.note);

              // Place the title of the note in the title input
              var noteTitle=data.note.title;
              // Place the body of the note in the body textarea
              var noteBody=data.note.body;
              console.log(noteTitle);
              $("#noteComments").append('<div class="text-left row p-3 rounded z-depth-1 #e0e0e0 grey lighten-2"><div class=p-2 text-left col-md-12"><h4 class="h4">' +  noteTitle +': <h4> </div><div class="col-md-10"><h6 class="h6 p-2 rounded bordered">' +  noteBody +'<h6> </div><div class="col-md-2 text-center p-0 m-0"><button class="m-0 p-0 btn btn-floating btn-danger" id="delBtn"><i class="m-0 fal fa-lg fa-comment-alt-times"></i></button></div></div>');
      
            }else{
              $("#noteComments").empty();
              $("#noteComments").append('<div class="col-md-12"><h6 class="h6">NO NOTES YET<h6> </div>');
      
            }
          });
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  }else{
    $('#ModalWarning').modal('show')

    return e;
  };
});
});