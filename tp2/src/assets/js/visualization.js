// debug
var debug; // used for debugging

// main canvas
var svg;

// svg limits 
var margin // {top, right, bottom, left}
  , width
  , height;

// chart scale attributes
var x
  , y;

// coordinate constructors
var xAxis // x axis
  , yAxis; // y axis

// colors
var color;

var metricToSort;

// flower attributes
var radius; // max radius value

// setup the main componentes of the visualization
function init() {
  margin = {top: 20, right: 50, bottom: 30, left: 50};
  width = window.innerWidth - margin.left - margin.right;
  height = (window.innerHeight/1.5) - margin.top - margin.bottom;

  x = d3.scaleBand()
    .rangeRound([0, width]);

  y = d3.scaleLinear().range([height, 0]);

  color = d3.scaleOrdinal(d3.schemeCategory10);;

  xAxis = d3.axisBottom(x);

  yAxis = d3.axisLeft(y);

  svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

// setup both axes of the visualization
function buildAxis(domainX) {
  x.domain(domainX);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  y.domain([0.0, 1.0]).nice();

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  radius = x.step()/2;
}

function insertFlowers(data, map, metrics) {
  var flowers = svg.selectAll(".flowers")
    .data(data)
    .enter()
    .append("g")
      .attr("class", "flowers");

  var line = flowers.append("line")
      .attr("x1", function(d) { return map[d.country].cx; })
      .attr("y1", function(d) { return map[d.country].cy; })
      .attr("x2", function(d) { return map[d.country].cx; })
      .attr("y2", height)
      .attr("stroke-width", 1)
      .attr("stroke", "green");

  var labels = flowers.append("text")
      .attr("font-family", "arial")
      .attr("font-size", "12px")
      .attr("fill", "black") 
      .style("font-weight", "bold")
      .attr("transform", function(d) { 
        return ("translate("+(map[d.country].cx - 2)
          +","+(map[d.country].cy + 15)+")rotate(90)"); 
      })
      .text(function(d) { return countries_[d.country].pt;});

  var center = flowers.append("g")
      .attr("class", "flower")
      .attr("data-target", function(d) { return d.country; })
      .attr("rel", "tooltip")
      .append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) { return map[d.country].cx; })
      .attr("cy", function(d) { return map[d.country].cy; })
      .style("fill", function(d) { return color(d.country); });

  var theta = 360/metrics.length;
  metrics.forEach(function(m, i) {
    var section = i * theta * Math.PI / 180.0;
    flowers.selectAll(".flower").append("line")
      .attr("x1", function(d) { return map[d.country].cx; })
      .attr("y1", function(d) { return map[d.country].cy; })
      .attr("x2", function(d) { return (map[d.country].cx + Math.cos(section)*radius*map[d.country][m]); })
      .attr("y2", function(d) { return (map[d.country].cy + Math.sin(section)*radius*map[d.country][m]); })
      .attr("stroke-width", 2)
      .attr("stroke", function(d) { return color(m); })
      .attr("class", "petal")
      .attr("data-target", m.replace(/ /g, "-"))
      .on("mouseover", function() {
        d3.selectAll(".petal").attr("opacity", 0.4);
        var selector = '[data-target=' + d3.select(this).attr("data-target") + ']';
        $(selector).attr("opacity", 1);
      }).on("mouseout", function() {
        d3.selectAll(".petal").attr("opacity", 1);
      });
  });

}
