var div;
var projectsTooltip;
var barSelected;
var keysTooltip = ["field", "type", "method"];
var colorTooltip;

function tooltip(colors) {
  colorTooltip = colors;
  projectsTooltip = projects;
  $("*[rel=tooltip]").on("mouseover", function(e) {
    var id = $(this).attr('data-target').split("p")[1];
    barSelected = dataCategory[id];
    drawChartTooltip(e.pageY, e.pageX, barSelected);
    showToolTip();
  }).on("mouseout", function(e){
    hideToolTip();
  });
}

var marginToolTip = {top: 15, right: 15, bottom: 20, left: 45},
  widthToolTip = 150 - marginToolTip.left - marginToolTip.right,
  heightToolTip = 100 - marginToolTip.top - marginToolTip.bottom;

var xToolTip = d3.scaleLinear()
  .range([0, widthToolTip]);

var yToolTip = d3.scaleBand()
  .rangeRound([0, heightToolTip])
  .padding(0.1);

var xAxisToolTip = d3.axisBottom(xToolTip).ticks(3);
var yAxisToolTip = d3.axisLeft(yToolTip).tickSize(0).tickPadding(6);

function drawChartTooltip(top, left, project){

  if(typeChart == 0){
    xToolTip.domain([0, max(project)]).nice(3);
  }else{
    xToolTip.domain([0, 1]).nice(3);
    xAxisToolTip.tickFormat(d3.format(".0%"));
  }
  yToolTip.domain(keysTooltip);

  d3.select(".tooltip").remove();

  div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("left", (left - 100) + "px")
    .style("top", (top - 170) + "px");

  div.append("div").attr("class", "tooltip-title").text(project["project"]);

  var svg = div.append("svg").attr("class", "svg-metrics")
    .attr("width", widthToolTip + marginToolTip.left + marginToolTip.right)
    .attr("height", heightToolTip + marginToolTip.top + marginToolTip.bottom)
    .append("g")
    .attr("transform", "translate(" + marginToolTip.left + "," + marginToolTip.top + ")");

  svg.selectAll(".barTooltip")
    .data(keysTooltip)
    .enter().append("rect")
    .attr("class", function(d) { return "barTooltip"; })
    .attr("fill", function(d, i) { return colorTooltip[i]; })
    .attr("x", function(d) { return xToolTip(Math.min(0, barSelected[d])); })
    .attr("y", function(d) { return yToolTip(d); })
    .attr("width", function(d) { return formatWidth(d); })
    .attr("height", yToolTip.bandwidth());

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + heightToolTip + ")")
    .call(xAxisToolTip);

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + xToolTip(0) + ",0)")
    .call(yAxisToolTip);
}

function max(project){
  var metrics = [];
  metrics[0] = +project["field"];
  metrics[1] = +project["method"];
  metrics[2] = +project["type"];
  return d3.max(metrics);
}

function min(project){
  var metrics = [];
  metrics[0] = +project["field"];
  metrics[1] = +project["method"];
  metrics[2] = +project["type"];
  return d3.min(metrics);
}

// function formatScales(d){
//   if(typeChart == 0){
//     return xToolTip(Math.min(0, barSelected[d]));
//   }else{
//     var total = barSelected["field"] + barSelected["method"] + barSelected["type"];
//     var perc = ((barSelected[d] / total));
//     return xToolTip(Math.min(0, perc));
//     // return perc;
//   }
// }

function formatWidth(d){
  if(typeChart == 0){
    return Math.abs(xToolTip(barSelected[d]) - xToolTip(0));
  }else{
    var total = barSelected["field"] + barSelected["method"] + barSelected["type"];
    var perc = ((barSelected[d] / total));
    return Math.abs(xToolTip(perc - xToolTip(0)));
  }
}

function showToolTip(){
  div.style("opacity", 1)
    .style("display","block");
}

function hideToolTip(){
  div.style("display","none");
}