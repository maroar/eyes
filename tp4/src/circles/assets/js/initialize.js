var margin = {top: 35, right: 50, bottom: 50, left: 80};
var width = (d3.select("#mainCanvas").node().offsetWidth) - margin.left - margin.right;
var height = (window.innerHeight/1.5) - margin.top - margin.bottom;

var x = d3.scaleLinear();

var y = d3.scaleLog()
  .base(2)
  .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);;

var xAxis = d3.axisBottom(x).ticks(0);

var yAxis = d3.axisLeft(y).ticks(11).tickFormat(function(d) { return y.tickFormat(11,d3.format(".3"))(Math.log(d)); });

var data;
var dataFilter;

var categories;

var filterData= 0;
var filterCategory = 0;

function initializeCategories(){
  categories = [];
  categories[0] = "Application";
  categories[1] = "Non-web libraries and frameworks";
  categories[2] = "Software tools";
  categories[3] = "System Software";
  categories[4] = "Web libraries and frameworks";
}