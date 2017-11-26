
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
            .attr("height", this.svgHeightLeague );



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


        var yAxisG = d3.select("#yAxisLeague")
            .attr("transform", "translate("+self.margin.left+"," + self.margin.top +")");
        // self.svg.append("g")
        // .attr("class" , "yAxis");

        console.log(yAxisG);

        yAxisG.transition(6000).call(yAxis);


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


        var xAxisG = d3.select("#xAxisLeague")
            .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.svgHeightLeague - self.margin.bottom) +")");
        // self.svg.append("g")
        // .attr("class" , "yAxis");

        console.log(xAxisG);

        xAxisG.transition(6000).call(xAxis);

        var xWidth =  self.svgWidthLeague - self.margin.left - self.margin.right;
        var yHeight  = self.svgHeightLeague - self.margin.top - self.margin.bottom;
        var xTrans = self.margin.left+ 10;
        var yTrans = self.margin.top;

        var rectWidth = xWidth/numSeasons;
        var rectHeight = yHeight/numClubs;


        var svgRects = d3.select("#rectBars");

        let barGroups = svgRects.selectAll(".barGroup")
            .data(clubData);

        // ------ taking care of entering elements ----
        let barGroupsEnter = barGroups.enter()
            .append("g")
            .classed("barGroup", true); // assigning the class

        // ------ taking care of removing elements ----
        barGroups.exit().remove();


        // appending and initializing the rects
        barGroupsEnter.append("rect")
            .attr("width", "0")
            .attr("height", 20)
            .style("fill", "gray");

        barGroupsEnter.append("text");

        // merge selections
        barGroups = barGroups.merge(barGroupsEnter);

        // ------ taking care of updates ----
        // update groups
        barGroups.attr("transform", function (d, i) {
            return "translate(0," + i * barHeight + ")";
        });

        // the selection propagates update data from the group to the rectangle
        barGroups.select("rect")
            .transition().duration(3000)
            .attr("width", function (d) {
                return d;
            })
            .style("fill", "steelblue")
            .attr("opacity", 1);




    };

    drawChart(playerData){
        let id = "#player-details";
        var width = 300,
            height = 300;
        var config = {
            w: width,
            h: height,
            maxValue: 100,
            levels: 5,
            ExtraWidthX: 300
        }

        let radarSvg = d3.select(id).selectAll('svg')
            .append('svg')
            .attr("width", width)
            .attr("height", height);

        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 150,
            TranslateY: 70,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
        };

        if('undefined' !== typeof config){
            for(var i in config){
                if('undefined' !== typeof config[i]){
                    cfg[i] = config[i];
                }
            }
        }

        cfg.maxValue = 100;

        var allAxis = (playerData[0].map(function(i, j){return i.attribute}));
        var total = allAxis.length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        var Format = d3.format('%');
        d3.select(id).select(".radar").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .attr("class", "radar")
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        //Circular segments
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .transition().duration(2000)
                .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }

        //Text indicating at what % each level is
        for(var j=0; j<cfg.levels; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .transition().duration(2000)
                .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
                .attr("fill", "#737373")
                .text((j+1)*100/cfg.levels);
        }

        let series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .transition().duration(2000)
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
            .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .transition().duration(2000)
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -10)"})
            .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
            .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

        let dataValues = [];
        playerData.forEach(function(y, x){
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .style("fill", "white")
                .style("stroke-width", "0px")
                .on('mouseover', function (d){
                    let z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                })
                .transition()
                .duration(1000)
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return cfg.color(series)})
                .style("fill-opacity", cfg.opacityArea);
            series++;
        });
        series=0;

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        playerData.forEach(function(y, x){
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .on('mouseover', function (d){
                    tooltip
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("display", "inline-block")
                        .html((d.attribute) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function(d){ tooltip.style("display", "none");})
                .transition().duration(2000)
                .attr("class", "radar-chart-serie"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                })
                .attr("cy", function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                })
                .attr("data-id", function(j){return j.attribute})
                .style("fill", "#fff")
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series)).style("fill-opacity", .9);

            series++;
        });

    }

};