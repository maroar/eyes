var margin = {top: 50, right: 100, bottom: 30, left: 80};

var width = (d3.select("#mainCanvas").node().offsetWidth) - margin.left - margin.right;
var height = (window.innerHeight/1.5) - margin.top - margin.bottom;

var side = Math.min(width, height);

var x = d3.scaleLinear();

var y = d3.scaleLinear();

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var data;
var dataFilter;

var categories;

var filterCategory = 0;

function initializeCategories(){
  categories = [];
  categories[0] = "Application";
  categories[1] = "Non-web libraries and frameworks";
  categories[2] = "Software tools";
  categories[3] = "System Software";
  categories[4] = "Web libraries and frameworks";
}