d3.csv("prius_gas.csv", function(error, data) {
  data.forEach(function(d) {
    d.MPG = +d.MPG;
  });

var width = 600;
var height = 600;

var y = d3.scale.linear()
	  .domain([0, 70])
	  .range([height, 0]);

var barWidth = width / data.length;

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });


bar.append("rect")
    .attr("y", function(d) { return y(d.MPG); })
    .attr("height", function(d) { return height - y(d.MPG); })
    .attr("width", barWidth - 5);

bar.append("text")
.attr("x", barWidth / 2)
.attr("y", function(d) { return y(d.MPG) + 3; })
.attr("dy", ".75em")
.text(function(d) { return d.MPG; });
})
