/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	    	if(row.percentage!==0){
	        	text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    	}
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){
			let self = this;

			let iPercent = parseFloat(electionResult[0].I_PopularPercentage === "" ? 0: electionResult[0].I_PopularPercentage);
			let dPercent = parseFloat(electionResult[0].D_PopularPercentage);
			let rPercent = parseFloat(electionResult[0].R_PopularPercentage);
			let percentArray = [];
			percentArray.push({party: "I", percent:iPercent, nominee: electionResult[0].I_Nominee_prop});
			percentArray.push({party: "D", percent:dPercent, nominee: electionResult[0].D_Nominee_prop});
			percentArray.push({party: "R", percent:rPercent, nominee: electionResult[0].R_Nominee_prop});
			percentArray.forEach(function(d){
				d.D_Nominee_prop= electionResult[0].D_Nominee_prop;
				d.R_Nominee_prop= electionResult[0].R_Nominee_prop;
				d.I_Nominee_prop= electionResult[0].I_Nominee_prop;
				d.D_Votes = electionResult[0].D_Votes;
				d.R_Votes = electionResult[0].R_Votes;
				d.I_Votes = electionResult[0].I_Votes;

			})
	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {
	                let tooltip_data = {
                       "result":[
                       {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": dPercent,"party":"D"} ,
                       {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": rPercent,"party":"R"} ,
                       {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": iPercent,"party":"I"}
                       ]
                    };
	                return self.tooltip_render(tooltip_data);
	            });


   			  // ******* TODO: PART III *******

		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.
		    let xScale = d3.scaleLinear()
                       .domain([0, 100])
                       .range([0, this.svgWidth]);
            let xPosition = [0];
            percentArray.forEach(function(data){
            	if(xPosition.length!==0){
            		xPosition.push(xPosition[xPosition.length-1]+data.percent);
            	}
            });
            let rect = this.svg.selectAll(".votesPercentage").data(percentArray);
            let newRect = rect.enter().append("rect");
            rect.exit().remove();
            rect = newRect.merge(rect);
            rect.attr("x", function(d,i){
            		return xScale(xPosition[i]);
            	})
            	.attr("y", 150)
            	.attr("height", 20)
            	.attr("width", function(d, i){
            		return xScale(d.percent);
            	})
            	.attr("class", function(d, i){
            		return self.chooseClass(d.party);
            	})
            	.classed("votesPercentage", true);

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary
		    let text = this.svg.selectAll(".votesPercentageText").data(percentArray);
		    let newText = text.enter().append("text");
		    text.exit().remove();
		    text = newText.merge(text);
		    text.attr("x", function(d, i){
		    		if(i===percentArray.length-1){
		    			return xScale(xPosition[xPosition.length-1]);
		    		} else {
		    			return xScale(xPosition[i]);
		    		}
		    	})
		    	.attr("y", 120)
		    	.text(function(d, i){
		    		return d.percent===0? "": d.percent+"%";
		    	})
		    	.attr("class", function(d,i){
		    		return self.chooseClass(d.party);
		    	})
		    	.classed("votesPercentageText", true);

		    let nominees = this.svg.selectAll(".nomineeNames").data(percentArray);
		    let newNominees = nominees.enter().append("text");
		    nominees.exit().remove();
		    nominees = newNominees.merge(nominees);
		    nominees.attr("x", function(d, i){
		    		if(i===percentArray.length-1){
		    			return xScale(xPosition[xPosition.length-1]);
		    		} else {
		    			return xScale(xPosition[i]);
		    		}
		    	})
		    	.attr("y", 80)
		    	.text(function(d, i){
		    		return d.nominee;
		    	})
		    	.attr("class", function(d,i){
		    		return self.chooseClass(d.party);
		    	})
		    	.classed("votesPercentageText", true);

		   	if(percentArray[0].percent!==0){
		    	let dText = text.filter(function(d){
		    		return d.party=== 'D';
		    	});
		    	dText.attr("transform", "translate(50, 0)");

		    	let dNominee = nominees.filter(function(d){
		    		return d.party=== 'D';
		    	});
		    	dNominee.attr("transform", "translate(180, 0)");
		    }

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.
		    let midPosition = xScale(xPosition[xPosition.length-1]/2);
		    this.svg.selectAll(".middlePoint").remove();
		    this.svg.append("rect")
		    		.attr("x", xScale(50))
		    		.attr("y", 145)
		    		.attr("height", 30)
		    		.attr("width", 3)
		    		.classed("middlePoint", true);

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element
		    this.svg.selectAll(".votesPercentageNote").remove();
		    this.svg.append("text")
		    		.attr("x", xScale(50))
		    		.attr("y", 120)
		    		.classed("votesPercentageNote", true)
		    		.text("Popular Vote(50%)");

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.
		    this.svg.call(tip);
		    rect.on("mouseover", tip.show);
		    rect.on("mouseout", tip.hide);

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}