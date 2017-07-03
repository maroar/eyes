var div;
// var projectsTooltip;
var projectSelected;
var textTooltip = ["Popularity", "Size", "Community", "Activity", "Maturity", "Replacement Message", "Category"];
var keysTooltip = ["Popularity", "Size", "Community", "Activity", "Maturity", "Repl", "category"];
var colorTooltip;

function tooltip(colors) {
  colorTooltip = colors;
  $("*[rel=tooltip]").on("mouseover", function(e) {
    var opacity = $(this).attr("data-target");
    if(opacity == "show"){
      var id = $(this).attr('id').split("l")[1];
      projectSelected = dataBackup[id];
      drawChartTooltip(e.pageY, e.pageX, projectSelected);
      showToolTip();
    }
  }).on("mouseout", function(e){
    hideToolTip();
  });
}

var marginToolTip = {top: 15, right: 15, bottom: 20, left: 45},
  widthToolTip = 150 - marginToolTip.left - marginToolTip.right,
  heightToolTip = 100 - marginToolTip.top - marginToolTip.bottom;

function drawChartTooltip(top, left, project){

  d3.select(".tooltip").remove();

  div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("left", (left - 100) + "px")
    .style("top", (top - 170) + "px");

  div.append("div").attr("class", "tooltip-title").text(project["project"]);

  var svg = div.append("div").attr("class", "svg-metrics")
    .attr("width", widthToolTip + marginToolTip.left + marginToolTip.right)
    .attr("height", heightToolTip + marginToolTip.top + marginToolTip.bottom)
    .attr("transform", "translate(" + marginToolTip.left + "," + marginToolTip.top + ")");

  svg.selectAll(".selectedTooltip")
    .data(keysTooltip)
    .enter().append("g")
    .attr("class", function(d) { return "selectedTooltip"; })
    .append("div")
    .text(function(d, i){ 
      var value = (d == "category") ? project[d] : parseFloat(project[d]).toFixed(2); 
      return (d == "Repl") ? textTooltip[i]+": "+value + "%" : textTooltip[i]+": "+value ;
    });
}

function showToolTip(){
  div.style("opacity", 1)
    .style("display","block");
}

function hideToolTip(){
  div.style("display","none");
}