var margin = {top: 40, right: 100, bottom: 20, left: 50},
    width = (d3.select("#mbars").node().offsetWidth*.9) - margin.left - margin.right,
    height = (window.innerHeight * 0.8) - margin.top - margin.bottom;

var number_colors = 3;

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.01);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    .domain(d3.range(number_colors))
    .range(d3.schemeCategory10);

var xAxis;
var yAxis;