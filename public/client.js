// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  $.get("/entries", function(entries) {
    entries.forEach(function(entry) {
      $("#entries").append(
        '<div class="entry"><h2>' +
          entry[0] +
          "</h2><p>" +
          entry[1] +
          "</p></div>"
      );
    });
  });

  $("form").submit(function(event) {
    event.preventDefault();
    var title = $("input#title").val();
    var entry = $("#entry").val();
    $.post("/entries?" + $.param({ title: title, entry: entry }), function() {
      $("#entries").append(
        '<div class="entry"><h2>' +
          title +
          "</h2><p>" +
          entry +
          "</p></div>"
      );
      $("input#title").val("");
      $("#entry").val("");
      $("input").focus();
    });
  });
});
