// miles.js: plot a line graph of odometer reading vs
// data from fill-up data in a .csv file

// Read in .csv data. Because d3.csv is asynchronous, all the
// graph drawing functions are contained within this d3.csv call
d3.csv("prius_gas.csv", function(error, csvdata) {
  csvdata.forEach(function(d) {
    d.date = new Date(d.Date);
    d.odometer = +d.Odometer;
  });

var margin = {top: 10, right: 30, bottom: 100, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var minDate = csvdata[0].date,
    maxDate = csvdata[csvdata.length - 1].date;

// Set up time based x axis
var x = d3.time.scale()
  .domain([minDate, maxDate])
  .range([0, width]);

var y = d3.scale.linear()
    .domain([0, d3.max(csvdata, function(d) { return d.odometer; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(7)
    .orient("left");

// put the graph in the "miles" div
var svg = d3.select("#miles").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// function to draw the line
var line = d3.svg.line()
    .x(function(d) { return x(d.date); } )
    .y(function(d) { return y(d.odometer); } );

//Mouseover tip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([120, 40])
  .html(function(d) {
    return "<strong>" + d.odometer + " miles</strong><br>" +
	  d.MPG + " mpg" + "<br>" +
	  d.Date + "<br>" + 
	  d.Brand + ", " + d.City + " " + d.State + "<br>";
  });

svg.call(tip);

// add the x axis and x-label
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 9)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .text("Month");

// add the y axis and y-label
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);
svg.append("text")
    .attr("class", "y label")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Odometer reading (mi)");

svg.append("text")
    .attr("class", "graphtitle")
    .attr("y", 30)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .text("MILES OVER TIME");

// draw the line
svg.append("path")
    .attr("d", line(csvdata));

svg.selectAll(".dot")
    .data(csvdata)
    .enter().append("circle")
    .attr('class', 'datapoint')
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d.odometer); })
    .attr('r', 6)
    .attr('fill', 'white')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', '3')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

}); // end of d3.csv
