d3.csv("prius_gas.csv", function(error, csvdata) {
  csvdata.forEach(function(d) {
    d = +d.MPG;
  });

var margin = {top: 10, right: 30, bottom: 50, left: 60},
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

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left");

var svg = d3.select("#mpg").append("svg")
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
    .attr("x", 3)
    .attr("width", widthscale * x(data[0].dx) - 3)
    .attr("height", function(d) { return height - y(d.y); });

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
});
