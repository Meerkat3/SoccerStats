
class PlayerAttributes {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (playerData, playerChart, selectedPlayer, selectedAttribute) {

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divPlayer = d3.select("#player_attributes").classed("fullView", true);

        //fetch the svg bounds
        // this.svgBounds = divyearChart.node().getBoundingClientRect();
        // this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // this.svgHeight = 100;

        //add the svg to the div
        // this.svg = divyearChart.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight)

        this.firstLoad = true;
        this.playerData = playerData;
        let players = [];
        this.selectedPlayer = selectedPlayer;
        this.playerData.forEach(function(player){
            players.push(player.player_name);
        });
        this.populateNames(players);
        d3.select("#player-select-btn")
            .on("click", this.showNames)
        this.update(this.selectedPlayer);
        this.playerChart = playerChart;
        this.playerChart.update([this.selectedPlayer], selectedAttribute);
        this.playerChart.populateSearch(players);
    };

    populateNames (players){
        let self = this;
        let li = d3.select("#player-names").selectAll('li').data(players);
        let newLi = li.enter().append('li');
        li.exit().remove();
        li = newLi.merge(li);
        li.on('click', function(d){
            self.selectedPlayer = d;
            self.showNames();
            self.update(d);
            self.playerChart.update([d], "overall_rating");
        })
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
        var x = document.getElementById("player-names");
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
        let imageUrl = null;
        let playerDetails= [];
        let singlePlayerData = null;
        this.playerData.forEach(function(player){
            if(player.player_name===name){
                singlePlayerData = player;
                imageUrl = player.image;
                playerDetails.push(player.player_name);
                playerDetails.push(player.birthday);
                playerDetails.push("Height : "+player.height);
                playerDetails.push("Weight : "+player.weight);
                playerDetails.push("Overall Rating: "+player.overall_rating);
            }
        })
        let imageSvg = d3.select("#image");
        imageSvg.select(".player-image").remove();
        imageSvg.append("svg:image")
            .attr("class", "player-image")
            .attr("xlink:href", imageUrl)
            .attr("x", "10")
            .attr("y", "10")
            .attr("width", "300")
            .attr("height", "300");

        let details = d3.select("#details").selectAll("text").data(playerDetails);
        let newDetails = details.enter().append("text");
        details.exit().remove();
        details = newDetails.merge(details);
        details.text(d => d)
            .attr("x", 100)
            .attr("y", function(d, i){
                return (i+1)*50;
            })
            .attr("class", function(d){
                return "player-text";
            })
            .attr("transform", "translate("+20+","+20+")");

        let attributes = [
            "overall_rating",
            "finishing",
            "dribbling",
            "acceleration",
            "sprint_speed",
            "volleys",
            "ball_control",
            "penalties",
            "free_kick_accuracy",
            "crossing",
            "balance",
            "aggression",
            "heading_accuracy",
            "jumping",
            "stamina",
            "short_passing",
            "long_passing",
            "interceptions",
            "positioning",
            "marking",
            "gk_reflexes"
        ];

        let data = [];
        attributes.forEach(function(s){
            data.push({"attribute": s, value: singlePlayerData[s]});
        });
        let realData = [];
        realData.push(data);
        this.drawChart(realData);

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
            ExtraWidthX: 250
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

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>"+d.attribute+":</strong> <span style='color:red'>" + d.value + "</span>";
            });
        radarSvg.call(tip);
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        playerData.forEach(function(y, x){
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .on('mouseover', tip.show)
                .on("mouseout", tip.hide)
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