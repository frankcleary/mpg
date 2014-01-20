// mpg.js: plot a histrogram from mpg data in a .csv file

// Read in .csv data. Because d3.csv is asynchronous, all the
// graph drawing functions are contained within this d3.csv call
d3.csv("prius_gas.csv", function(error, csvdata) {
  csvdata.forEach(function(d) {
    d = +d.MPG;
  });

var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// Set the limits of the x axis
var xmin = 35
var xmax = 60

// This scale is for determining the widths of the histogram bars
// Must start at 0 or else x(binsize a.k.a dx) will be negative
var x = d3.scale.linear()
  .domain([0, xmax])
  .range([0, width]);

// Scaling parameter to resize bars to viewing area
var widthscale = xmax / (xmax - xmin)

// Scale for the placement of the bars
var x2 = d3.scale.linear()
  .domain([xmin, xmax])
  .range([0, width]);

// Make an array with the mpg values
var values = [];
csvdata.forEach(function(d) { values.push(d.MPG); });

// Split mpg data into 10 bins
var data = d3.layout.histogram()
    .bins(x2.ticks(10))
    (values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x2)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left");

// put the graph in the "mpg" div
var svg = d3.select("#mpg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up the bars
var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x2(d.x) + "," + y(d.y) + ")"; });

// add rectangles of correct size at correct location
bar.append("rect")
    .attr("x", 3)
    .attr("width", widthscale * x(data[0].dx) - 3)
    .attr("height", function(d) { return height - y(d.y); });

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
    .text("MPG");

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
    .text("# of fill-ups");
}); // end of d3.csv
