
function processForm() {
    let $new = $("<li><svg><circle></circle></svg><div><h5></h5><p></p></div></li>");
    $new.addClass("media");
    $new.find("div").addClass("media-body");
    $new.find("h5").html("lala");
    $new.find("p").html($("#usercomment").val());
    $new.find("svg").attr({
        "height": 100,
        "width": 100
    });
    $new.find("circle").attr({
        "cx": 50,
        "cy": 50,
        "r": 40,
        "fill": $("input[name=inputcolor]:checked").val()
    });
    //append the new comment and reset the form
    $("#comments").append($new);
    $("form")[0].reset();
}


function writeFile() {
    $.post("writefile.php", {
        filename: "save.txt",
        contents: $("#main").html()
    });
}

window.onload = function () {
    loadFile();
}

function loadFile() {
    $("#main").load("save.txt")
}


