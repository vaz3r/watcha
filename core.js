function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roomClicked(element) {
    var loggedRoom = element.getAttribute("event-id");

    if (loggedRoom !== null) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("username", loggedRoom + "-" + getRandomInt(1000, 99999));
            localStorage.setItem("loggedRoom", loggedRoom);
            window.location.href = "chat.html";
        } else {
            console.log("NO STORAGE SUPPORT!")
        }
    }
}

function loadTodaysGames() {
    var cards = document.getElementById("games-cards");

    if (cards !== null) {
        var httpClient = new XMLHttpRequest();

        httpClient.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(httpClient.responseText);

                for (var i = 0; i <= json.scoreboard.length - 1; i++) {
                    var obj = json.scoreboard[i];

                    if (obj.eventIsCompleted.includes("False")) {
                        var game_template = '<article onclick="roomClicked(this);" class="game" event-id="{#event-id}" title="{#title}"><div class="game-info"><figure class="team-logo"><img alt="Logo" src="{#logoHome}"></figure><h2 class="team-abr">{#abbreviationHome}</h2><span class="team-vs">VS.</span><h2 class="team-abr">{#abbreviationAway}</h2><figure class="team-logo"><img alt="Logo" src="{#logoAway}"></figure></div></article>';

                        game_template = game_template.replace(/{#event-id}/gi, obj.eventShortName.replace("@", "-").replace(" ", "").replace(/\s/g, "").toLowerCase());
                        game_template = game_template.replace(/{#title}/gi, obj.eventName + "\n" + obj.eventAirTime);
                        game_template = game_template.replace(/{#logoHome}/gi, obj.logoHome);
                        game_template = game_template.replace(/{#abbreviationHome}/gi, obj.abbreviationHome);
                        game_template = game_template.replace(/{#abbreviationAway}/gi, obj.abbreviationAway);
                        game_template = game_template.replace(/{#logoAway}/gi, obj.logoAway);

                        cards.innerHTML += game_template;
                    } else {
                        //EVENT IS COMPLETED
                    }
                }

                //CHECK IF NO GAME AVAILABLE
            }
        };

        url = "https://watchat-watchatcore.a3c1.starter-us-west-1.openshiftapps.com/scoreboard/" + getEST();

        httpClient.open("GET", url, true);
        httpClient.send();
    } else {
        // console.log("NO CARDS")
    }
}

function loadGameInfo() {
    var chat = document.getElementById("game-info");

    if (chat !== null) {
        var loggedRoom = localStorage.getItem("loggedRoom");
        var username = localStorage.getItem("username");

        if (loggedRoom == null) {
            window.location.href = "index.html";
        } else if (username == null) {
            username = loggedRoom + "-" + getRandomInt(1000, 99999);
            localStorage.setItem("username", username);
        }

        var httpClient = new XMLHttpRequest();

        httpClient.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(httpClient.responseText);

                for (var i = 0; i <= json.scoreboard.length - 1; i++) {
                    var obj = json.scoreboard[i];
                    var room = obj.eventShortName.replace("@", "-").replace(" ", "").replace(/\s/g, "").toLowerCase();

                    if (room.includes(loggedRoom)) {
                        var game_template = '<article class="game" title="{#title}"><div class="game-info"><figure class="team-logo"><img alt="Logo" src="{#logoHome}"></figure><div class="team-score"><h2 class="team-abr">{#displayNameHome}</h2><h2 id="scoreHome" class="score">{#scoreHome}</h2></div><span class="team-vs">VS.</span><div class="team-score"><h2 class="team-abr">{#displayNameAway}</h2><h2 id="scoreAway" class="score">{#scoreAway}</h2></div><figure class="team-logo"><img alt="Logo" src="{#logoAway}"></figure></div></article>';

                        game_template = game_template.replace(/{#title}/gi, obj.eventName + "\n" + obj.eventAirTime);
                        game_template = game_template.replace(/{#displayNameHome}/gi, obj.displayNameHome);
                        game_template = game_template.replace(/{#displayNameAway}/gi, obj.displayNameAway);
                        game_template = game_template.replace(/{#logoHome}/gi, obj.logoHome);
                        game_template = game_template.replace(/{#logoAway}/gi, obj.logoAway);
                        game_template = game_template.replace(/{#scoreHome}/gi, obj.scoreHome);
                        game_template = game_template.replace(/{#scoreAway}/gi, obj.scoreAway);

                        chat.innerHTML += game_template;
                        break;
                    }
                }
                playGoal();
                updateGameInfo();
            }
        };

        url = "https://watchat-watchatcore.a3c1.starter-us-west-1.openshiftapps.com/scoreboard/" + getEST();

        httpClient.open("GET", url, true);
        httpClient.send();
    } else {
        console.log("NO CHAT WINDOW");
    }
}

function playGoal() {
    var goalAudio = document.getElementById("goalAudio");
    goalAudio.play();
}

function updateGameInfo() {
    window.setInterval(function () {
        var httpClient = new XMLHttpRequest();

        var scoreHome = document.getElementById("scoreHome");
        var scoreAway = document.getElementById("scoreAway");
        var loggedRoom = localStorage.getItem("loggedRoom");

        httpClient.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(httpClient.responseText);

                for (var i = 0; i <= json.scoreboard.length - 1; i++) {
                    var obj = json.scoreboard[i];
                    var room = obj.eventShortName.replace("@", "-").replace(" ", "").replace(/\s/g, "").toLowerCase();

                    if (room.includes(loggedRoom)) {
                        if (scoreHome.innerHTML !== obj.scoreHome) {
                            playGoal();
                        }

                        if (scoreAway.innerHTML !== obj.scoreAway) {
                            playGoal();
                        }

                        scoreHome.innerHTML = obj.scoreHome;
                        scoreAway.innerHTML = obj.scoreAway;

                        if (obj.eventStatus.includes("Scheduled")) {

                        }

                        break;
                    }
                }
            }
        };

        url = "https://watchat-watchatcore.a3c1.starter-us-west-1.openshiftapps.com/scoreboard/" + getEST();

        httpClient.open("GET", url, true);
        httpClient.send();
    }, 60000);
}

function onSendMSG(element) {
    var key = window.event.keyCode;

    if (key === 13) {
        if (element.value.length >= 3) {
            sendMsg(element.value);
            element.value = "";
        }
        return false;
    } else {
        return true;
    }
}

function sendMessageBtn() {
    var chatMessage = document.getElementById("chat-message-text");

    if (chatMessage.value.length >= 3) {
        sendMsg(chatMessage.value);
        chatMessage.value = "";
    }
}

function sendMsg(message) {
    var loggedRoom = localStorage.getItem("loggedRoom");
    var username = localStorage.getItem("username");
    var timeStamp = Math.floor(Date.now() / 1000);

    firebase.database().ref(loggedRoom + '/messages/' + timeStamp).set({
        loggedRoom: loggedRoom,
        username: username,
        message: message
    });
}

function readMsgs() {
    var loggedRoom = localStorage.getItem("loggedRoom");
    var chatMessages = document.getElementById("chat-messages");
    var chatContainer = document.getElementById("chat-container");

    if (chatContainer !== null) {
        var messages = firebase.database().ref(loggedRoom + '/messages');

        messages.on('child_added', function (snapshot) {
            var message_template = '<li><article class="message"><figure class="message-avatar"><img alt="Logo" src="static/avatar.svg"></figure><div class="message-info"><span class="message-sender">@{#username}</span><span class="message-text">{#message}</span></div></article></li>';
            message_template = message_template.replace(/{#username}/gi, snapshot.val().username);
            message_template = message_template.replace(/{#message}/gi, snapshot.val().message);
            chatMessages.innerHTML += message_template;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            // console.log(snapshot.key + "/" + snapshot.val().message);
        });
    }
}

loadTodaysGames();
loadGameInfo();
readMsgs();

function getEST() {
    var dt = new Date();
    var offset = -300; //Timezone offset for EST in minutes.
    var estDate = new Date(dt.getTime() + offset * 60 * 1000).toJSON().slice(0, 10).replace(/-/g, '');
    return estDate;
}

function homePage() {
    window.location.href = "index.html";
}