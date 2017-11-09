   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight);

        this.hello = "hello";

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){

          // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    let iText = 0;
    let dText = 0;
    let rText = 0;
    let iStatesWidth = 0;
    let electionData = d3.nest()
                        .key(d => d.State_Winner)
                        .rollup(function(values){
                            return values.sort(function(a, b){
                                return d3.ascending(parseFloat(a.RD_Difference), parseFloat(b.RD_Difference));
                            });
                        })
                        .entries(electionResult);
    let iData = [];
    let dData = [];
    let rData = [];
    electionData.forEach(function(party){
        if(party.key === "I"){
            iData = party.value;
            if(iData.length>0){
                iStatesWidth = d3.sum(iData, function(state){
                    return parseInt(state.Total_EV);
                })
                iText = parseInt(iData[0].I_EV_Total);
            }
        }
        else if(party.key === "D"){
            dData = party.value;
            dText = parseInt(dData[0].D_EV_Total);
        }
        else if(party.key === "R"){
            rData = party.value;
            rText = parseInt(rData[0].R_EV_Total);
        }

    });
    let stackedData = [];
    Array.prototype.push.apply(stackedData, iData);
    Array.prototype.push.apply(stackedData, dData);
    Array.prototype.push.apply(stackedData, rData);

    let xPositions = [0];
    stackedData.forEach(function(result){
        let length = xPositions.length;
        let width = parseFloat(result.Total_EV);
        xPositions.push(xPositions[length-1] + width);
    });

    let xScale = d3.scaleLinear()
                       .domain([0, xPositions[xPositions.length-1]])
                       .range([0, this.svgWidth]);

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    let rect = this.svg.selectAll("rect").data(stackedData);
    
    let newRect = rect.enter()
                    .append("rect");
    rect.exit().remove();
    rect = newRect.merge(rect);
    rect.attr("y", 50)
                    .attr("height", 20)
                    .attr("width", function(d, i){
                        if(i===xPositions.length-1){
                            return xScale(parseFloat(d.Total_EV));
                        } else {
                            return xScale(xPositions[i+1]-xPositions[i]);
                        }
                    })
                    .attr("x", function(d, i){
                        return xScale(xPositions[i]);
                    })
                    .style("fill", function(d, i){
                        if(d.State_Winner==="I"){
                            return "green";
                        }
                        return colorScale(parseFloat(d.RD_Difference));
                    })
                    .classed("electoralVotes", true);


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    this.svg.selectAll(".electoralVoteText").remove();
    if(iText!==0){
        this.svg.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .text(iText)
            .attr("class", this.chooseClass("I"))
            .classed("electoralVoteText", true);
    }
    if(dText!==0){
        this.svg.append("text")
            .attr("x", xScale(iStatesWidth))
            .attr("y", 40)
            .text(dText)
            .attr("class", this.chooseClass("D"))
            .classed("electoralVoteText", true);
    }
    if(rText!==0){
        this.svg.append("text")
            .attr("x", xScale(xPositions[xPositions.length-1]))
            .attr("y", 40)
            .text(rText)
            .attr("class", this.chooseClass("R"))
            .classed("electoralVoteText", true);
    }


    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    let midPosition = xScale(xPositions[xPositions.length-1]/2);
    this.svg.selectAll(".middlePoint").remove();
    this.svg.append("rect")
            .attr("x", midPosition)
            .attr("y", 45)
            .attr("height", 30)
            .attr("width", 3)
            .classed("middlePoint", true)
            .style("fill", "black");


    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element
    let votesNeeded = Math.ceil(((iText+dText+rText)/2)+1);
    let midText = "Electoral Vote (" + votesNeeded+" needed to win)"; 
    this.svg.selectAll(".electoralVotesNote").remove();
    this.svg.append("text")
            .attr("x", midPosition)
            .attr("y", 40)
            .text(midText)
            .classed("electoralVotesNote", true)
            .style("fill", "black");

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    let self = this;
    let brush = d3.brushX().extent([[0,45],[this.svgWidth,75]]).on("end", function(){
        let selected = d3.event.selection;
        if(selected!==null){
            let min  = xScale.invert(selected[0]);
            let max  = xScale.invert(selected[1]);
            let selectedStates = []
            for (var i = 0; i < xPositions.length-1; i++) {
            // selecting the states even if half portion is inside brush selection
                if((xPositions[i]>=min && xPositions[i+1]<=max) ||
                    (xPositions[i]<min && xPositions[i+1]>=min) ||
                    (xPositions[i]<=max && xPositions[i+1]>max)){
                    selectedStates.push(stackedData[i].State);
                }
            }
            self.shiftChart.update(selectedStates);
        }
        
    });
    this.svg.append("g").attr("class", "brush").call(brush);

    };

    
}
