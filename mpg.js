// mpg.js: plot a histrogram from mpg data in a .csv file

function parser(d) {
    d.pMPG = +d.MPG;
    d.pOdometer = +d.Odometer;
    d.pDate = new Date(d.Date);
    return d;
}

var format = d3.time.format("%m/%d/%Y");

function milesovertime(csvdata) {
    var margin = {top: 10, right: 30, bottom: 100, left: 100};
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var minDate = csvdata[0].pDate;
    var maxDate = csvdata[csvdata.length - 1].pDate;

    // Set up time based x axis
    var x = d3.time.scale()
	.domain([minDate, maxDate])
	.range([0, width]);

    var y = d3.scale.linear()
	.domain([0, d3.max(csvdata, function(d) { return d.pOdometer; })])
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
	.x(function(d) { return x(d.pDate); } )
	.y(function(d) { return y(d.pOdometer); } );

    //Mouseover tip
    var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([120, 40])
	.html(function(d) {
	    return "<strong>" + d.Odometer + " miles</strong><br>" +
		d.MPG + " mpg" + "<br>" +
		format(d.pDate) + "<br>" + 
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
	.attr("class", "xlabel")
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
	.attr("class", "ylabel")
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
	.attr('cx', function(d) { return x(d.pDate); })
	.attr('cy', function(d) { return y(d.pOdometer); })
	.attr('r', 6)
	.attr('fill', 'white')
	.attr('stroke', 'steelblue')
	.attr('stroke-width', '3')
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);
}

function mpghist(csvdata) {
    var binsize = 2;
    var minbin = 36;
    var maxbin = 60;
    var numbins = (maxbin - minbin) / binsize;

    var binmargin = .2; // whitespace on either side of the bars in units of MPG
    var margin = {top: 10, right: 30, bottom: 50, left: 60};
    var width = 450 - margin.left - margin.right;
    var height = 250 - margin.top - margin.bottom;

    // Set the limits of the x axis
    var xmin = minbin - 1
    var xmax = maxbin + 1

    histdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
	if (i < histdata.length) {
	    histdata[i] = { numfill: 0, meta: "" };
	}
    }

    csvdata.forEach(function(d) {
	var bin = Math.floor((d.pMPG - minbin) / binsize);
	if ((bin.toString() != "NaN") && (bin < histdata.length)) {
	    histdata[bin].numfill += 1;
	    histdata[bin].meta += "<tr><td>" + d.City + " " + d.State + 
		"</td><td>" + format(d.pDate) + 
		"</td><td>" + d.pMPG.toFixed(1) + " mpg</td></tr>";
	}
    });

    // This scale is for determining the widths of the histogram bars
    // Must start at 0 or else x(binsize a.k.a dx) will be negative
    var x = d3.scale.linear()
	.domain([0, (xmax - xmin)])
	.range([0, width]);

    // Scale for the placement of the bars
    var x2 = d3.scale.linear()
	.domain([xmin, xmax])
	.range([0, width]);

    // Make an array with the mpg values
    var values = [];
    csvdata.forEach(function(d) { values.push(d.MPG); });

    var y = d3.scale.linear()
	.domain([0, d3.max(histdata, function(d) { return d.numfill; })])
	.range([height, 0]);

    var xAxis = d3.svg.axis()
	.scale(x2)
	.orient("bottom");
    var yAxis = d3.svg.axis()
	.scale(y)
	.ticks(8)
	.orient("left");

    var tip = d3.tip()
	.attr('class', 'd3-tip')
	.direction('e')
	.offset([0, 20])
	.html(function(d) {
	    return '<table id="tiptable">' + d.meta + "</table>";
	});

    // put the graph in the "mpg" div
    var svg = d3.select("#mpg").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // set up the bars
    var bar = svg.selectAll(".bar")
	.data(histdata)
	.enter().append("g")
	.attr("class", "bar")
	.attr("transform", function(d, i) { return "translate(" + x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; })
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);

    // add rectangles of correct size at correct location
    bar.append("rect")
	.attr("x", x(binmargin))
	.attr("width", x(binsize - 2*binmargin))
	.attr("height", function(d) { return height - y(d.numfill); });

    // add the x axis and x-label
    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
    svg.append("text")
	.attr("class", "xlabel")
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
	.attr("class", "ylabel")
	.attr("y", 0 - margin.left) // x and y switched due to rotation!!
	.attr("x", 0 - (height / 2))
	.attr("dy", "1em")
	.attr("transform", "rotate(-90)")
	.style("text-anchor", "middle")
	.text("# of fill-ups");
}

// Read in .csv data and make graphs
d3.csv("prius_gas.csv", parser,
       function(error, csvdata) {
	   mpghist(csvdata);
	   milesovertime(csvdata);
}); // end of d3.csv
