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
    httpClient.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    httpClient.setRequestHeader('Origin', 'stats.nba.com');
    httpClient.setRequestHeader('Host', 'stats.nba.com');
    httpClient.setRequestHeader('Referer', 'https://stats.nba.com/scores/10/19/2018');
    httpClient.setRequestHeader('x-nba-stats-origin', 'stats');
    httpClient.setRequestHeader('X-NewRelic-ID', 'VQECWF5UChAHUlNTBwgBVw==');
    httpClient.setRequestHeader('x-nba-stats-token', 'true');
    httpClient.send();
}

loadTodaysGames();