
class Leagues {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (leagueData , selectedLeague) {

        // Initializes the svg elements required for this chart
        this.margin = {top: 30, right: 20, bottom: 30, left: 140};
        let divHeatMap = d3.select("#performance_years").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divHeatMap.node().getBoundingClientRect();
        // console.log(this.svgBounds);
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 600;

        //add the svg to the div
        // this.svg = divyearChart.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight)

        this.firstLoad = true;
        this.leagueData = leagueData;
        // let players = [];
        this.selectedLeague = selectedLeague;

        var leagues = leagueData.map(d => d.league_name);

        var uniqueLeagues  = leagues.filter(function(item, pos) {
            return leagues.indexOf(item) == pos;
        });

        console.log(uniqueLeagues);

        // this.playerData.forEach(function(player){
        //     players.push(player.player_name);
        // });
        this.populateNames(uniqueLeagues);
        document.getElementById("league-names").style.display = "none";
        d3.select("#league-select-btn")
            .on("click", this.showNames);


        var divColorLegend = d3.select("#color_legend").classed("legend", true);
        var divLeagueDetails = d3.select("#league_details").classed("heatmap", true);

        //fetch the svg bounds
        // this.svgBoundsLegend = divColorLegend.node().getBoundingClientRect();
        // console.log(this.svgBoundsLegend);
        this.svgWidthLegend = 0.3*this.svgBounds.width- this.margin.left - this.margin.right ;
        // console.log(this.svgWidthLegend );
        this.svgHeightLegend = 600;

        //fetch the svg bounds
        // this.svgBoundsLeague = divLeagueDetails.node().getBoundingClientRect();
        // console.log(this.svgBoundsLeague);
        this.svgWidthLeague = 0.7*this.svgBounds.width - this.margin.left - this.margin.right ;
        // console.log(this.svgWidthLeague );
        this.svgHeightLeague = 600;

        this.svgLegend = d3.select("#legend")
            .attr("width", this.svgWidthLegend)
            .attr("height", this.svgHeightLegend );


        this.svgLeague = d3.select("#league")
            .attr("width", this.svgWidthLeague)
            .attr("height", this.svgHeightLeague )
            .attr("transform", "translate(50,0)");


        // $("#league-names li:nth-child(2)").click();
        // this.update(this.selectedPlayer);
        // this.playerChart = playerChart;
        // this.playerChart.update([this.selectedPlayer], selectedAttribute);
        // this.playerChart.populateSearch(players);
    };

    populateNames (uniqueLeagues){
        let self = this;
        let li = d3.select("#league-names").selectAll('li').data(uniqueLeagues);
        let newLi = li.enter().append('li');
        li.exit().remove();
        li = newLi.merge(li);
        li.on('click', function(d){
            self.selectedLeague = d;
            // self.showNames();
            self.update(d);
        });
        li.transition()
            .duration(1000)
            .text(d => d);
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    showNames (){

        var x = document.getElementById("league-names");
        if (x.style.display === "none" || x.style.display === "") {
            x.style.display = "flex";
        } else {
            x.style.display = "none";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update (name) {
        var self = this;

        var clubData = self.leagueData.filter(function(d){
            return d.league_name == name;
        });

        console.log(clubData);

        var points = clubData.map(d => +d.points);

        // var svgLegend = d3.select("svg");

        // Color legend.
        var colorScale = d3.scaleQuantize()
            .domain([ d3.min(points), d3.max(points) ])
            .range(colorbrewer.YlGn[9]);

        var colorLegend = d3.legendColor()
            .labelFormat(d3.format(".0f"))
            .scale(colorScale)
            .shapePadding(10)
            .shapeWidth(30)
            .shapeHeight(30)
            .labelOffset(10);

        self.svgLegend.selectAll("*").remove();

        self.svgLegend.append("g")
            .attr("transform", "translate(50, 60)")
            .call(colorLegend);

        var clubs = clubData.map(d => d.team_long_name);

        var uniqueClubs  = clubs.filter(function(item, pos) {
            return clubs.indexOf(item) == pos;
        });

        console.log(uniqueClubs);

        var numClubs = uniqueClubs.length;

        var seasons = clubData.map(d => d.season);

        var uniqueSeasons = seasons.filter(function(item, pos) {
            return seasons.indexOf(item) == pos;
        });

        console.log(uniqueSeasons);

        var numSeasons = uniqueSeasons.length;




        let yScale = d3.scaleLinear()
            .domain( [0 , numClubs])
    .range([ 0 , self.svgHeightLeague - self.margin.top - self.margin.bottom]);

        let yAxis = d3.axisLeft()
            .tickFormat(function(d, i ) {
                console.log(uniqueClubs[i]);
                return uniqueClubs[i];
            })
            .ticks(numClubs);
        // assign the scale to the axis
        yAxis.scale(yScale);


        var y = d3.select(".yAxisLeague")
            .data(["dummy"]);


        // var xAxisG = d3.select("#xAxisLeague")
        var yAxisG = y.enter().append("g")
            // .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.svgHeightLeague - self.margin.bottom) +")")
            .attr("class", "yAxisLeague");
        // self.svg.append("g")
        // .attr("class" , "yAxis");

        y.exit().remove();

        // console.log(yAxisG);

        // xAxisG.transition(6000).call(xAxis);

        y = y.merge(yAxisG).transition(6000)
            .attr("transform", "translate("+self.margin.left+"," + self.margin.top +")")
            .call(yAxis);
        //
        //
        // var yAxisG = d3.select("#yAxisLeague")
        //     .attr("transform", "translate("+self.margin.left+"," + self.margin.top +")");
        // // self.svg.append("g")
        // // .attr("class" , "yAxis");
        //
        // console.log(yAxisG);
        //
        // yAxisG.transition(6000).call(yAxis);


        let xScale = d3.scaleLinear()
            .domain([ 0 , numSeasons])
            .range([0, self.svgWidthLeague - self.margin.left - self.margin.right]);



        let xAxis = d3.axisBottom()
            .tickFormat(function(d, i ) {
            console.log(uniqueSeasons[i]);
            return uniqueSeasons[i];
        })
            .ticks(numSeasons);
        // assign the scale to the axis
        xAxis.scale(xScale);


        var x = d3.select(".xAxisLeague")
            .data(["dummy"]);


        // var xAxisG = d3.select("#xAxisLeague")
        var xAxisG = x.enter().append("g")
            .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.svgHeightLeague - self.margin.bottom) +")")
            .attr("class", "xAxisLeague");
        // self.svg.append("g")
        // .attr("class" , "yAxis");

        x.exit().remove();

        console.log(xAxisG);

        // xAxisG.transition(6000).call(xAxis);

        x = x.merge(xAxisG).transition(6000)
            .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.svgHeightLeague - self.margin.bottom) +")")
            .call(xAxis);


        var xWidth =  self.svgWidthLeague - self.margin.left - self.margin.right;
        var yHeight  = self.svgHeightLeague - self.margin.top - self.margin.bottom;
        var xTrans = self.margin.left+ 10;
        var yTrans = self.margin.top;

        var rectWidth = xWidth/numSeasons;
        var rectHeight = yHeight/numClubs;


        var svgRects = d3.select("#league");

        svgRects.selectAll("#league-name").remove();
        svgRects
            .append("text")
            .attr("x", 350)
            .attr("y", 20)
            .attr("id", "league-name")
            .text(name);
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong> Team:</strong> <span style='color:red'>" + d.team_long_name + "</span> <br>"
                    + "<strong> Rank:</strong> <span style='color:red'>" + d.rank+ "</span> <br>"
                    + "<strong> Points:</strong> <span style='color:red'>" + d.points+ "</span> <br>"
                    + "<strong> Season:</strong> <span style='color:red'>" + d.season+ "</span>";
            });
        svgRects.call(tip);

        let barGroups = svgRects.selectAll(".barGroup")
            .data(clubData);

        // ------ taking care of entering elements ----
        let barGroupsEnter = barGroups.enter()
            .append("g")
            .classed("barGroup", true) // assigning the class
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)

        // ------ taking care of removing elements ----
        barGroups.exit().remove();


        // appending and initializing the rects
        barGroupsEnter.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", "white");

        // barGroupsEnter.append("text");

        // merge selections
        barGroups = barGroups.merge(barGroupsEnter);

        // ------ taking care of updates ----
        // update groups
        barGroups.attr("transform", function (d) {
            var x = xTrans + uniqueSeasons.indexOf(d.season) * rectWidth;
            var y = yTrans + uniqueClubs.indexOf(d.team_long_name) * rectHeight;

            return "translate(" + x  +"," + y + ")";
        });

        // the selection propagates update data from the group to the rectangle
        barGroups.select("rect")
            .transition().duration(5000)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", d => colorScale(d.points))
            .attr("opacity", 1);


        var yaxisText = d3.select(".yAxisLeague").selectAll("text");
        yaxisText
            .transition().duration(5000)
            .attr("transform", "translate(0,"+rectHeight/2+")");

        var xaxisText = d3.select(".xAxisLeague").selectAll("text");
        xaxisText.transition().duration(5000)
            .attr("transform", "translate("+rectWidth/2+",0)");


    };


};