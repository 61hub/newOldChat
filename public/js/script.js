var socketServer = io.connect();
console.log(socketServer);
function sendMessage () {
    var input = document.getElementsByTagName("input")[0];
    if (input.value.length > 0) {
        socketServer.emit("message", input.value);
        input.value = "";
    }
}

var userName = prompt("What`s your name?");
socketServer.emit("join", userName);
socketServer.on("message", function (message) {
    var messages = document.getElementsByClassName("messages")[0];
    messages.innerHTML += "<div>" + message + "</div>";
});
var button = document.getElementsByTagName("button")[0];
button.addEventListener("click", sendMessage );

var form = document.getElementById("send");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendMessage();
});

