var div;
var dataTooltip;
var keys;
var countriesTooltip;
var flowerSelected;

function tooltip(d, k, c) {
  dataTooltip = d;
  formatData(k);
  countriesTooltip = c;
  $("*[rel=tooltip]").on("mouseover", function(e) {
    var title = $(this).attr('title');
    flowerSelected = $(this).attr('data-target');
    drawChartTooltip(e.pageY, e.pageX, flowerSelected);
    showToolTip();
  }).on("mouseout", function(e){
    hideToolTip();
  });
}


var marginToolTip = {top: 15, right: 10, bottom: 20, left: 85},
  widthToolTip = 150 - marginToolTip.left - marginToolTip.right,
  heightToolTip = 200 - marginToolTip.top - marginToolTip.bottom;

var xToolTip = d3.scaleLinear()
  .range([0, widthToolTip]);

var yToolTip = d3.scaleBand()
  .rangeRound([0, heightToolTip])
  .padding(0.1);

var xAxisToolTip = d3.axisBottom(xToolTip).ticks(3);
var yAxisToolTip = d3.axisLeft(yToolTip).tickSize(0).tickPadding(6);

function formatData(key){
  keys = key.map(function(d){
    return d.replace("-", " ");
  });
  keys.shift();
  keys.sort();
}

function drawChartTooltip(top, left, key){

  xToolTip.domain([0, d3.max(keys, function(d){ return dataTooltip[key][d];})]).nice(3);
  yToolTip.domain(keys);

  d3.select(".tooltip").remove();

  div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("left", (left - 100) + "px")
    .style("top", (top - 280) + "px");

  div.append("div").attr("class", "tooltip-title").text(countriesTooltip[flowerSelected].pt);

  var svg = div.append("svg").attr("class", "svg-metrics")
    .attr("width", widthToolTip + marginToolTip.left + marginToolTip.right)
    .attr("height", heightToolTip + marginToolTip.top + marginToolTip.bottom)
    .append("g")
    .attr("transform", "translate(" + marginToolTip.left + "," + marginToolTip.top + ")");

  svg.selectAll(".bar")
    .data(keys)
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar--positive"; })
    .attr("x", function(d) { return xToolTip(Math.min(0, dataTooltip[flowerSelected][d])); })
    .attr("y", function(d) { return yToolTip(d); })
    .attr("width", function(d) { return Math.abs(xToolTip(dataTooltip[flowerSelected][d]) - xToolTip(0)); })
    .attr("height", yToolTip.bandwidth());

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightToolTip + ")")
    .call(xAxisToolTip);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + xToolTip(0) + ",0)")
    .call(yAxisToolTip);
}

function showToolTip(){
  div.style("opacity", 1)
    .style("display","block");
}

function hideToolTip(){
  div.style("display","none");
}