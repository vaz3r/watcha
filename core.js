function loadTodaysGames() {
    var cards = document.getElementById("games-cards");

    if (cards !== null) {
        var httpClient = new XMLHttpRequest();

        httpClient.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(httpClient.responseText);
    
                for (var i = 0; i <= json.scoreboard.length - 1; i++) {
                    var obj = json.scoreboard[i];
    
                    var game_template = '<article class="game" event-id="{#event-id}" title="{#title}"><div class="game-info"><figure class="team-logo"><img src="{#logoHome}"></figure><h2 class="team-abr">{#abbreviationHome}</h2><span class="team-vs">VS.</span><h2 class="team-abr">{#abbreviationAway}</h2><figure class="team-logo"><img src="{#logoAway}"></figure></div></article>';
                    
                    game_template = game_template.replace(/{#event-id}/gi, obj.eventShortName.replace("@", "").replace(" ", "").replace(/\s/g, "").toLowerCase());
                    game_template = game_template.replace(/{#title}/gi, obj.eventName + "\n" + obj.eventAirTime);
                    game_template = game_template.replace(/{#logoHome}/gi, obj.logoHome);
                    game_template = game_template.replace(/{#abbreviationHome}/gi, obj.abbreviationHome);
                    game_template = game_template.replace(/{#abbreviationAway}/gi, obj.abbreviationAway);
                    game_template = game_template.replace(/{#logoAway}/gi, obj.logoAway);
    
                    cards.innerHTML += game_template;
                }
            }
        };
    
        var utc = new Date().toJSON().slice(0,10).replace(/-/g,'');
        url = "https://watchat-watchatcore.a3c1.starter-us-west-1.openshiftapps.com/scoreboard/" + utc;
    
        httpClient.open("GET", url, true);
        httpClient.send();
    } else {
        console.log("NO CARDS")
    }
}

loadTodaysGames();