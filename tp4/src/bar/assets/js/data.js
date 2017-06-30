var data;
var dataCategory;
var legends = ["field", "type", "method"];
var projects;
var v;
var categories;
var filterData;
var typeChart;
var percentage;

function processData() {
  getData();
  getTypeChart();
}

function initializeCategories(){
  categories = [];
  categories[0] = "Application";
  categories[1] = "Non-web libraries and frameworks";
  categories[2] = "Software tools";
  categories[3] = "System Software";
  categories[4] = "Web libraries and frameworks";
}

function getData(){
  name = $("input[name='category']:checked").attr("data-target");
  if(name != filterData){
    filterData = name;
    var filterCategory = categories[filterData];
    dataCategory = [];
    data.forEach(function(d) {
      if (d.category == filterCategory) {
        dataCategory.push(d);
      }
    });

    projects = [];
    v = [[], [], []];
    percentage = [[], [], []];
    dataCategory.forEach(function(d, i) {
      d.id = i;
      d.field = +d.field;
      d.method = +d.method;
      d.type = +d.type;
      calculatePercentage(d);
      projects.push(d.id);
      v[0].push(d.field);
      v[1].push(d.type);
      v[2].push(d.method);
    });

    absolute = true;
  }
}

function getTypeChart(){
  typeChart = $("input[name='mode']:checked").attr("data-target");
}

function calculatePercentage(d){
  total = d.field + d.method + d.type;
  if(total == 0){
    percentage[0].push(total);
    percentage[1].push(total);
    percentage[2].push(total);
  } else{
    percentage[0].push((d.field/total));
    percentage[1].push((d.type/total));
    percentage[2].push((d.method/total));
  } 
}