var socketServer = io.connect();
console.log(socketServer);

var userName = prompt("What`s your name?");
socketServer.emit("join", userName);
socketServer.on("message", function (message) {
    var messages = document.getElementsByClassName("messages")[0];
    messages.innerHTML += "<div>" + message + "</div>";
})
var button = document.getElementsByTagName("button")[0];
button.addEventListener("click", function () {
    console.log("Button clicked");
    var input = document.getElementsByTagName("input")[0];
    socketServer.emit("message", input.value);
    input.value = "";
    

})