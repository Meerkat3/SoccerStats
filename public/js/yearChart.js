
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
    constructor (yearData, selectedPlayer, selectedAttribute) {

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
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - 350;
        this.svgHeight = 400;

        this.selectedPlayers = [selectedPlayer];

        // //add the svg to the div
        // this.svg = divyearChart.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight);

        //add the svg to the div
        this.svg = d3.select("#lineChart")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("transform", "translate("+-400+","+50+")");
        $("#select2-search").select2({
            placeholder: "select a player to compare"
        });
        let self = this;
        this.selectedAttribute = selectedAttribute;
        $('#select2-search').on("change", function(e) {
            let selectedName = e.target.value;
            let alreadyAdded = false;
            for(let name of self.selectedPlayers){
                if(name === selectedName){
                    alreadyAdded = true;
                    break;
                }
            }
            if(!alreadyAdded){
                self.selectedPlayers.push(e.target.value);
                self.update(self.selectedPlayers, self.selectedAttribute);
            }
            // $('#select2-search').val('');
        });
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
            "heading_accuracy",
            "aggression",
            "jumping",
            "stamina",
            "short_passing",
            "long_passing",
            "interceptions",
            "positioning",
            "marking",
            "gk_reflexes"
        ];
        let attributeDropdown = document.getElementById('attribute-search');
        for(var i = 0; i < attributes.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = attributes[i];
            opt.value = attributes[i];
            attributeDropdown.appendChild(opt);
        }
        d3.select('#attribute-search')
            .on('change', function() {
                self.changeAttribute();
            });
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

    populateSearch(players){
        $("#select2-search").select2({
            placeholder: "select a player to compare",
            data: players
        })
    };

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update(nameList, attrib) {

        var self = this;
        var playerYearDataList = [];

        var attribValues = [];

        var yearValues = [];
        this.selectedPlayers = nameList;
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

        yAxisG.transition(3000).call(yAxis);


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
        let color = d3.scaleLinear()
            .domain([0, playerYearDataList.length])
            // .range(["#016450", "#ece2f0"]);
            .range(["#2019F6", "#F61936"]);

        xAxisG.transition(3000).call(xAxis);
        self.svg.selectAll(".playerPath").remove();
        self.svg.selectAll(".playerNode").remove();
        let playerIndex = 0;
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
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    let style = 'color:red; left:'+d3.event.pageX+'px; top:'+d3.event.pageY+'px;';
                    return "<span style='"+style+"'>" + player.name + "</span> ";
                });
            self.svg.call(tip);
            lineCoords.forEach(function(point){
                self.svg.append('circle').attr('cx', point[0])
                    .attr("cy", point[1])
                    .attr("r", 5)
                    .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.margin.top) +")")
                    .style("fill", color(playerIndex))
                    .attr("class", "playerNode")
                    .attr("id", player.name+"-node")
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);
            })

            self.svg.append('path')
                .attr('d', pathString)
                .attr("transform", "translate("+(self.margin.left+ 10)+"," + (self.margin.top) +")")
                .attr("style", "fill : none;")
                .attr("class", "playerPath")
                .attr("id", player.name+"-path")
                .style("stroke", function(d, i){
                    return color(playerIndex);
                })
                .style("stroke-width", 3)
                .style('opacity', 0.5)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);
            playerIndex++;
        });

        d3.selectAll(".brush").remove();
        d3.selectAll("#performance_per_years svg").remove()
        var brush = d3.brushX().extent([[self.margin.left,self.svgHeight-self.margin.bottom-20],[self.svgWidth,self.svgHeight-10]]).on("end", brushed);

        self.svg.append("g").attr("class", "brush").call(brush);


        function brushed() {
            console.log(d3.event.selection);

            var sel = d3.event.selection;

            if(sel === null){
                return;
            }

            var yearValuesBrushed = yearValues.filter((d) => xScale(d)+self.margin.left+ 10 >= sel["0"] &&  xScale(d)+self.margin.left+ 10  <= sel["1"]);

            var uniqueYrs = yearValuesBrushed.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });

            console.log(uniqueYrs);


            // var dataSel = self.posd.filter((d) => d.position >= sel["0"] && d.position <= sel["1"]);
            // window.selectedStatesIn = dataSel.map( d => d.elem);
            // self.shiftChart.update(window.selectedStatesIn, window.selectedYearsIn);
            self.updateBars(playerYearDataList, uniqueYrs , attrib, color);


        }

        this.listPlayers(nameList, color);
    };

    updateBars(playerYearDataList, yearSelection , attrib, colorScale){

        console.log(playerYearDataList);
        console.log(yearSelection);
        console.log(attrib);
        if(playerYearDataList.length === 1){
            return;
        }
        var self = this;
        self.svgBars = d3.select("#barChart")
            .attr("width", self.svgWidth)
            .attr("height", self.svgHeight);

        let divyearBars = d3.select("#performance_per_years").classed("fullView", true);

        divyearBars.selectAll("*").remove();

        var svgBounds = divyearBars.node().getBoundingClientRect();
        var svgWidth = svgBounds.width - self.margin.left - self.margin.right;

        var svgHeight = 300;
        var svgHeightMargin = 50;

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:red'>" + d.name + "</span> "
                        +"<span style='color:white'>" + d.value+ "</span>";
            });

        // //add the svg to the div

        yearSelection.forEach(function(year){

            var playerAttrib = [];

            var attribs = [];

            playerYearDataList.forEach(function(player){

                var yearData =  player.playerYearData.filter(function(d){
                    return +d.year == year
                })[0];
                if(yearData=== undefined){
                    return;
                }
                playerAttrib.push(
                    {
                        name: player.name,
                        data : yearData,
                        value: +yearData[attrib]
                    }
                );

                attribs.push(+yearData[attrib]);

            });

            console.log(playerAttrib);

            console.log(attribs);

            //
            // var attribValues = [];
            //
            // nameList.forEach(function(name){
            //
            //     var plyrData =  self.yearData.filter(function(d){
            //         return d.player_name == name;
            //     });
            //     playerYearDataList.push(
            //         {
            //             "name" : name,
            //             "playerYearData" : plyrData.sort(function(x, y){
            //                 return d3.ascending(+x.year, +y.year);
            //             })
            //         })
            //
            //     attribValues = attribValues.concat(plyrData.map(function(d){
            //         return +d[attrib];
            //     }));
            //
            //     yearValues = yearValues.concat(plyrData.map(function(d){
            //         return +d.year;
            //     }));
            //
            // });
            //
            let singleSvgWidth = svgWidth/yearSelection.length;
            var numOfChartsPerRow = playerYearDataList.length>3 ? 2: 3;
            var svgbar = divyearBars.append("svg")
                .attr("width", singleSvgWidth)
                .attr("height", svgHeight+svgHeightMargin);
            svgbar.call(tip);

            var yScale = d3.scaleLinear()
                .domain([Math.max(d3.min(attribs) - 10 , 0 ), d3.max(attribs)])
                .range([svgHeight - self.margin.top - self.margin.bottom, 0]);


            console.log(svgHeight - self.margin.top - self.margin.bottom);
            console.log(yScale(9));

            let yAxis = d3.axisLeft();
            // assign the scale to the axis
            yAxis.scale(yScale);


            var yAxisG = svgbar.append("g")  //d3.select("#yAxis")
                .attr("transform", "translate("+self.margin.left+"," + self.margin.top +")");
            // self.svg.append("g")
            // .attr("class" , "yAxis");

            console.log(yAxisG);

            yAxisG.transition(3000).call(yAxis);

            let xAxisWidth = Math.min(singleSvgWidth-self.margin.right-self.margin.left, 200);
            let xScale = d3.scaleLinear()
                .domain([0, playerYearDataList.length])
                .range([0, xAxisWidth]);

            let xAxis = d3.axisBottom();
            // assign the scale to the axis
            var rectWidth = (svgWidth/2 - self.margin.left - self.margin.right)/attribs.length;
            rectWidth = xAxisWidth/playerYearDataList.length;
            xAxis.scale(xScale).ticks(playerYearDataList.length)
                .tickFormat(function(d){
                    if(d < playerYearDataList.length && rectWidth >= 50){
                        return playerYearDataList[d].name;
                    }
                    return "";
                });


            var xAxisG = svgbar.append("g") //d3.select("#xAxis")
                .attr("transform", "translate("+(self.margin.left+ 10)+"," + (svgHeight - self.margin.bottom) +")");
            // self.svg.append("g")
            // .attr("class" , "yAxis");

            console.log(xAxisG);

            xAxisG.transition(3000).call(xAxis)
                .selectAll("text")
                .style("text-anchor", "start")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "translate("+(rectWidth/2)+",5), rotate(30)");


            var bars = svgbar.selectAll("#bars")
                .data(playerAttrib);

            var newBars = bars
                .enter()
                .append("rect")
                .attr("x" , (d,i) => self.margin.left+10 + i*rectWidth)
                .attr("y" , function(d){
                    return yScale(d.value);
                })
                // d => self.margin.top + ( yScale(d3.max(attribs))- yScale(d)))
                .attr("width", rectWidth)
                .attr("height", d => {
                    return svgHeight - yScale(d.value) - self.margin.bottom;
                })
                .attr("class", function(d, i){
                    return playerAttrib[i].name+"-bar";
                })
                .classed("yearBar", true)
                .style("fill", function(d, i){
                    return colorScale(i)
                })
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            bars.exit()
                .attr("opacity", 1)
                .transition()
                .duration(3000)
                .attr("opacity", 0)
                .remove();


            bars = newBars.merge(bars);

            bars
                .transition()
                .duration(3000)
                .attr("x" , (d,i) => self.margin.left+10 + i*rectWidth)
                .attr("y" , d => yScale(d.value)+self.margin.top)
                // d => self.margin.top + ( yScale(d3.max(attribs))- yScale(d)))
                .attr("width", rectWidth)
                .attr("height", d => {
                    return svgHeight - yScale(d.value) - self.margin.bottom - self.margin.top;
                });
            // let text = svgbar.selectAll("text.playerName").data(attribs);
            // let newText = text.enter().append("text");
            // text.exit().remove();
            // text = newText.merge(text);
            // text.transition()
            //     .duration(3000)
            //     .attr("x", (d, i) => self.margin.left + 10 + i * rectWidth+(rectWidth/2))
            //     .attr("y", d => yScale(d)+100)
            //     .attr("class","playerName")
            //     .text(function (d, i) {
            //         return playerAttrib[i].name;
            //     });
            svgbar.append('text')
                .attr('x', self.margin.left+10+(playerAttrib.length/2)*rectWidth)
                .attr('y', svgHeight+(svgHeightMargin/2))
                .style('text-anchor','middle')
                .text(year);

        });

    };

    listPlayers(nameList, colorScale) {
        let self = this;
        let listSvg = d3.select("#selected-players");
        listSvg.selectAll('#listTitle').remove();
        // listSvg.append('text')
        //     .attr('x', 50)
        //     .attr('y', 0)
        //     .attr('id', 'listTitle')
        //     .text("Selected Players to compare")
        //     .style('fill', 'black');
        let li = listSvg.selectAll('.selected-names').data(nameList);
        let newLi = li.enter().append('li').attr('class','selected-names');
        li.exit().remove();
        li = newLi.merge(li);
        li.on('click', function(d){
            let players = [];
            if(self.selectedPlayers.length === 1){
                return;
            }
            for(let name of self.selectedPlayers){
                if(name === d){
                    continue;
                }
                players.push(name);
            }
            self.selectedPlayers = players;
            self.update(self.selectedPlayers, self.selectedAttribute);
        });
        li.transition()
            .duration(1000)
            .text(function(d){
                return d + " x";
            })
            .attr('x', 100)
            .attr('y', function(d, i){
                return (i+1)*20;
            })
            .style("color", function (d, i) {
                return colorScale(i);
            })
            .attr("transform", "translate(0, 20)")
            .style("cursor", "pointer");
        // d3.select("#removeInfo").remove();
        // d3.select("#selected-players").append("text")
        //     .attr("id", "removeInfo")
        //     .text("Click on player name to remove from comparison")
    }

    changeAttribute(){
        let attr = document.getElementById("attribute-search").value;
        if(this.selectedAttribute!==attr){
            this.selectedAttribute = attr;
            this.update(this.selectedPlayers, this.selectedAttribute);
        }
    }
};