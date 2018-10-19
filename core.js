function loadTodaysGames() {
    var httpClient = new XMLHttpRequest();
    httpClient.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(httpClient.responseText);
            console.log(json);
            // for (var i = 0; i <= json.data.length - 1; i++) {
                
            // }
        }
    };

    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    url = "https://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=" + utc;

    httpClient.open("GET", url, true);
    httpClient.send();
}

loadTodaysGames();