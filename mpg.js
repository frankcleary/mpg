d3.csv("prius_gas.csv", function(error, csvdata) {
  csvdata.forEach(function(d) {
    d = +d.MPG;
  });

var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var xmin = 35
var xmax = 60

var x = d3.scale.linear()
  .domain([0, xmax])
  .range([0, width]);

var x2 = d3.scale.linear()
  .domain([xmin, xmax])
  .range([0, width]);

var values = [];

csvdata.forEach(function(d) { values.push(d.MPG); });

var formatCount = d3.format(",.0f");

var data = d3.layout.histogram()
    .bins(x2.ticks(10))
    (values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x2)
    .orient("bottom");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x2(d.x) + "," + y(d.y) + ")"; });

var widthscale = xmax / (xmax - xmin)

bar.append("rect")
    .attr("x", 1)
    .attr("width", widthscale * x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
	.attr("x", widthscale * x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

});
