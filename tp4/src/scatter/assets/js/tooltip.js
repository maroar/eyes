var div;
var projectsTooltip;
var barSelected;
var keysTooltip = ["rm", "ed", "category"];
var keysText = ["Replacement message", "Deprecated Elements", "Category"];
var colorTooltip;

function tooltip() {
  $("*[rel=tooltip]").on("mouseover", function(e) {
    var id = $(this).attr('id').split("c")[1];
    circleSelected = dataFilter[id];
    drawChartTooltip(e.pageY, e.pageX, circleSelected);
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

var xAxisToolTip;
var yAxisToolTip = d3.axisLeft(yToolTip).tickSize(0).tickPadding(6);

function drawChartTooltip(top, left, project){

  d3.select(".tooltip").remove();

  div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("left", (left - 100) + "px")
    .style("top", (top - 100) + "px");

  div.append("div").attr("class", "tooltip-title").text(project["project"]);

  var svg = div.append("div").attr("class", "svg-metrics")
    .attr("width", widthToolTip + marginToolTip.left + marginToolTip.right)
    .attr("height", heightToolTip + marginToolTip.top + marginToolTip.bottom)
    .attr("transform", "translate(" + marginToolTip.left + "," + marginToolTip.top + ")");

  svg.selectAll(".circleTooltip")
    .data(keysTooltip)
    .enter().append("g")
    .attr("class", function(d) { return "circleTooltip"; })
    .append("div")
    .text(function(d, i){ 
      var value = (d == "category") ? circleSelected[d] : parseFloat(circleSelected[d]).toFixed(2) + "%"; 
      return keysText[i]+": "+value ;
    });
}

function showToolTip(){
  div.style("opacity", 1)
    .style("display","block");
}

function hideToolTip(){
  div.style("display","none");
}