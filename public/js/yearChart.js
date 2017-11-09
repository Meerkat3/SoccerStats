
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
    constructor (electoralVoteChart, tileChart, votePercentageChart, shiftChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        this.shiftChart = shiftChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
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
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        let self = this;

       // ******* TODO: PART I *******

       //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line
    this.svg.append("line")
            .attr("x1", 0)
            .attr("x2", (this.electionWinners.length+1)*75)
            .attr("y1", 50)
            .attr("y2", 50)
            .style("stroke-dasharray","2,2")//dashed array for line
            .classed("lineChart", true);

    let brush = d3.brushX().extent([[0,35],[this.svgWidth,65]]).on("end", function(){
        let selected = d3.event.selection;
        if(selected!==null){
            let min  = selected[0];
        let max  = selected[1];
        let selectedYears = []
        for (var i = 0; i < self.electionWinners.length; i++) {
            // selecting the states even if half portion is inside brush selection
            let position = (i+1)*75;
            if(position>= min && position<=max){
                selectedYears.push(self.electionWinners[i].YEAR);
            }
        }
        self.shiftChart.updateYears(selectedYears);
        }
        
    });
    this.svg.append("g").attr("class", "brush").call(brush);

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
    let circles = this.svg.selectAll("circle").data(this.electionWinners)
            .enter()
            .append("circle")
            .attr("cx", function(d, i){
                return (i+1)*75;
            })
            .attr("cy", 50)
            .attr("class", function(d, i){
                return self.chooseClass(d.PARTY);
            })
            .attr("r", 10);

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements
    this.svg.selectAll("text").data(this.electionWinners)
            .enter()
            .append("text")
            .attr("x", function(d, i){
               return (i+1)*75; 
            })
            .attr("y", 90)
            .classed("yeartext", true)
            .text(function(d){
                return d.YEAR;
            });

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle
    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations
    circles.on("click", function(d){
        d3.selectAll(".highlighted").classed("highlighted", false);
        d3.selectAll(".yearChart").attr("r", 10);
        d3.select(this).classed("highlighted", true).attr("r", 20);

        d3.csv("data/Year_Timeline_"+d.YEAR+".csv", function (error, electionInfo) {
            self.electoralVoteChart.update(electionInfo, self.colorScale);
            self.votePercentageChart.update(electionInfo);
            self.tileChart.update(electionInfo, self.colorScale);
        });
    });


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

    };

};