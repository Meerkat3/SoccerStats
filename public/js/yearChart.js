
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (yearData) {

        //Creating YearChart instance
        // this.electoralVoteChart = electoralVoteChart;
        // this.tileChart = tileChart;
        // this.votePercentageChart = votePercentageChart;
        // this.shiftChart = shiftChart;
        // // the data
        // this.electionWinners = electionWinners;

        this.yearData = yearData;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 30, bottom: 30, left: 50};
        let divyearChart = d3.select("#performance_years").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 400;

        // //add the svg to the div
        // this.svg = divyearChart.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight);

        //add the svg to the div
        this.svg = d3.select("#lineChart")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);
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

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update(nameList, attrib) {

            var self = this;
            var playerYearDataList = [];

            var attribValues = [];

            var yearValues = [];

            nameList.forEach(function(name){

                var plyrData =  self.yearData.filter(function(d){
                    return d.player_name == name;
                });
                playerYearDataList.push(
                    {
                        "name" : name,
                        "playerYearData" : plyrData.sort(function(x, y){
                            return d3.ascending(+x.year, +y.year);
                        })
                    })

                attribValues = attribValues.concat(plyrData.map(function(d){
                    return +d[attrib];
                }));

                yearValues = yearValues.concat(plyrData.map(function(d){
                    return +d.year;
                }));

            });
            // var playerYearData = self.yearData.filter(function(d){
            //     return d.player_name == name;
            // });

        // playerYearData = playerYearData.sort(function(x, y){
        //     return d3.ascending(+x.year, +y.year);
        // });

            console.log(playerYearDataList);

            // var attribValues = playerYearData.map(function(d){
            //     return +d[attrib];
            // });



            console.log(attribValues);

        console.log(yearValues);
            console.log(d3.min(attribValues));
        console.log(d3.max(attribValues));

        console.log(d3.min(yearValues));
        console.log(d3.max(yearValues));

            // console.log(d3.min(attribValues, d => +d));

            let yScale = d3.scaleLinear()
                .domain([d3.min(attribValues, d => d), d3.max(attribValues, d => d)])
                .range([self.svgHeight - self.margin.top - self.margin.bottom, 0]);

            let yAxis = d3.axisLeft();
            // assign the scale to the axis
            yAxis.scale(yScale);


            var yAxisG = d3.select("#yAxis")
                .attr("transform", "translate("+self.margin.left+"," + self.margin.top +")");
                // self.svg.append("g")
                // .attr("class" , "yAxis");

            console.log(yAxisG);

            yAxisG.call(yAxis);


        let xScale = d3.scaleLinear()
            .domain([d3.min(yearValues), d3.max(yearValues)])
      .range([0, self.svgWidth - self.margin.left - self.margin.right]);

        let xAxis = d3.axisBottom();
        // assign the scale to the axis
        xAxis.scale(xScale);


        var xAxisG = d3.select("#xAxis")
            .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.svgHeight - self.margin.bottom) +")");
        // self.svg.append("g")
        // .attr("class" , "yAxis");

        console.log(xAxisG);

        xAxisG.call(xAxis);

        playerYearDataList.forEach(function(player){
            console.log(player.name);
            console.log(player.playerYearData);

            var lineCoords = player.playerYearData.map(function(d){
                return [xScale(+d.year) , yScale(+d[attrib])];
            });

            console.log(lineCoords);

            var lineGenerator = d3.line();
            var pathString = lineGenerator(lineCoords);

            console.log(pathString);

            self.svg.append('path')
                .attr('d', pathString)
                .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.margin.top) +")")
                .attr("style", "fill : none ;stroke: black")

            ;

        });


    };

};