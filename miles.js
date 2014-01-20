// miles.js: plot a line graph of odometer reading vs
// data from fill-up data in a .csv file

// Read in .csv data. Because d3.csv is asynchronous, all the
// graph drawing functions are contained within this d3.csv call
d3.csv("prius_gas.csv", function(error, csvdata) {
  csvdata.forEach(function(d) {
    d.date = new Date(d.Date);
    d.odometer = +d.Odometer;
  });

var margin = {top: 10, right: 30, bottom: 50, left: 80},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

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
    .ticks(6)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(14)
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

// add the x axis and x-label
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .text("Date");

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

// draw the line
svg.append("path")
    .attr("d", line(csvdata));
}); // end of d3.csv
