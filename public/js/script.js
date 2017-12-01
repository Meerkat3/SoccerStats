function openCity(evt, tabName) {
    if(tabName === "ProcessBook"){
        window.open("Process Book.pdf");
        return;
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();
d3.select("#sreekanth")
    .on("click", function(){
        window.open("https://www.linkedin.com/in/sreekanth-reddy-konda-aa06129b/");
    });
d3.select("#sravan")
    .on("click", function(){
        window.open("https://www.linkedin.com/in/sneerati/");
    });


d3.csv("data/Latest_attributes.csv", function (error, playerDaya) {
    d3.csv("data/player_data.csv", function (error, yearData) {
        let selectedPlayer = "Lionel Messi";
        let selectedAttribute = "overall_rating";
        let yearAttribs = new YearChart(yearData, selectedPlayer, selectedAttribute);
        let playerAttributes = new PlayerAttributes(playerDaya, yearAttribs, selectedPlayer, selectedAttribute);
    });
});




d3.csv("data/League.csv", function (error, leagueData) {

    console.log(leagueData);
    let selectedLeague = "England Premier League";
    let leagues = new Leagues(leagueData, selectedLeague);
});




