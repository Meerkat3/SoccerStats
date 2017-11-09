/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + (this.margin.left-10) + ",0)")
        this.svg = divTiles.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
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
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            if(row.percentage!==""){
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
                text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            }
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){

            //Calculates the maximum number of columns to be laid out on the svg
            this.maxColumns = d3.max(electionResult,function(d){
                                    return parseInt(d["Space"]);
                                });

            //Calculates the maximum number of rows to be laid out on the svg
            this.maxRows = d3.max(electionResult,function(d){
                                    return parseInt(d["Row"]);
                            });

            //Creates a legend element and assigns a scale that needs to be visualized
            this.legendSvg.append("g")
                .attr("class", "legendQuantile")
                .attr("transform", "translate(0,50)");

            let legendQuantile = d3.legendColor()
                .shapeWidth(75)
                .cells(10)
                .orient('horizontal')
                .scale(colorScale);

            this.legendSvg.select(".legendQuantile")
                .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('se')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                    let tooltip_data = {
                       "state": d.State,
                       "winner":d.State_Winner,
                       "electoralVotes" : d.Total_EV,
                       "result":[
                       {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                       {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
                       {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
                       ]
                    };
                       
                    return self.tooltip_render(tooltip_data);
                });

            // ******* TODO: PART IV *******
            //Tansform the legend element to appear in the center and make a call to this element for it to display.

            //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

            //Display the state abbreviation and number of electoral votes on each of these rectangles

            //Use global color scale to color code the tiles.

            //HINT: Use .tile class to style your tiles;
            // .tilestext to style the text corresponding to tiles
            let self = this;
            let tileWidth = parseFloat(this.svgWidth/12);
            let tileHeight = parseFloat(this.svgHeight/8);
            let tiles = this.svg.selectAll(".tile").data(electionResult);
            let newTiles = tiles.enter().append("rect");
            tiles.exit().remove();
            tiles = newTiles.merge(tiles);
            tiles.attr("x", function(d){
                    return parseInt(d.Space)*tileWidth;
                 })
                 .attr("y", function(d, i){
                    return parseInt(d.Row)*tileHeight;
                 })
                 .attr("height", tileHeight)
                 .attr("width", tileWidth)
                 .style("fill", function(d){
                    return colorScale(parseFloat(d.RD_Difference));
                 })
                 .classed("tile", true);

            let tileText = this.svg.selectAll(".tilestext").data(electionResult);
            let newTileText = tileText.enter().append("text");
            tileText.exit().remove();
            tileText = newTileText.merge(tileText);

            tileText.attr("x", function(d){
                        return parseInt(d.Space)*tileWidth+tileWidth/2;
                    })
                    .attr("y", function(d, i){
                        return parseInt(d.Row)*tileHeight+30;
                    })
                    .text(function(d){
                        return d.Abbreviation;
                    })
                    .classed("tilestext", true)
                    .style("text-anchor", "middle")
                    .append("tspan")
                    .text(function(d){
                        return d.Total_EV;
                    })
                    .attr("x", function(d){
                        return parseInt(d.Space)*tileWidth+tileWidth/2;
                    })
                    .attr("y", function(d, i){
                        return parseInt(d.Row)*tileHeight+50;
                    });

            //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
            //then, vote percentage and number of votes won by each party.
            //HINT: Use the .republican, .democrat and .independent classes to style your elements.
            this.svg.call(tip);
            tiles.on("mouseover", tip.show);
            tiles.on("mouseout", tip.hide);

    
    };


}
