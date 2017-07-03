function handleMouseOver(d, i) {  
  d3.selectAll("circle").attr("opacity", 0.1);
  d3.select("#c" + i).attr("opacity", 1);
  d3.select("#c" + i).attr("fill", function(d) { return color(d.category); }).attr("r", radius*2);
}

function handleMouseOut(d, i) {
  d3.select("#c" + i).transition().delay(200).attr("r", function() { return (d.rm/100)*radius; }).on("end", function(a) { this.setAttribute("fill", "none") });

  d3.selectAll("circle").attr("opacity", 1);

}


function buildVisualization(){
  d3.selectAll("svg").remove();

  if(filterCategory == 0){
    margin.right = 300;
  }else {
    margin.right = 50;
  }

  width = (d3.select("#mainCanvas").node().offsetWidth) - margin.left - margin.right;
  
  x.range([0, width]);

  x.domain([0, dataFilter.length]);

  y.domain(d3.extent(ys));

  svg = d3.select("#mainCanvas").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
      .call(xAxis).selectAll("text").remove();

  svg.append("g")
    .attr("class", "y axis")
      .call(yAxis);

  svg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate(" + (-50) +","+(height/2)+")rotate(-90)")  
    .text("Attribute Mean (log scale)");

  svg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ (width/2) +","+ (height+20) +")") 
    .text("Projects");

  circles = svg.append("g").selectAll("circle")
    .data(dataFilter)
    .enter()
      .append("circle")
        .attr("rel", "tooltip")
        .attr("cx", function(d, i) { return x(i); })
        .attr("cy", function(d) { return y(d.avgAll); })
        .attr("r", function(d) { return (d.rm/100)*radius; })
        .attr("id", function(d, i) { return "c" + i; })
        .attr("stroke", function(d) { return color(d.category); })
        .attr("fill", "none")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
}

function buildFilterCategories(){

  var divOptionData = d3.select("body")
    .select("#filterCategory")
    .append("div")
    .attr("class", "btn-group filter")
    .attr("data-toggle", "buttons-radio");  

  divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter")
      .attr("class", "btn btn-large")
      .attr("data-target", 0)
      .text("All");

  categories.forEach(function(m, i) {
    divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter")
      .attr("class", "btn btn-large")
      .attr("data-target", (i + 1))
      .text(m);
  }); 

  $(".filter a[data-target='0']")
    .addClass("activeFilter")
    .attr("style", "color: red;");

  $("*[rel=filter]").on("click", function(e) {
    var id = $(this).attr('data-target');

    $(".filter a")
      .removeClass("activeFilter")
      .removeAttr("style");
    
    $(".filter a[data-target='"+id+"']")
    .addClass("activeFilter")
    .attr("style", "color: red;");

    filter();

  });
}

function buildFilterData(){

  var divOptionData = d3.select("body")
    .select("#filterData")
    .append("div")
    .attr("class", "btn-group filter-data")
    .attr("data-toggle", "buttons-radio");  

  divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter-data")
      .attr("class", "btn btn-large")
      .attr("data-target", 0)
      .text("Alphabetical");

  divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter-data")
      .attr("class", "btn btn-large")
      .attr("data-target", 1)
      .text("Replacement Message Percentual");

  $(".filter-data a[data-target='0']")
    .addClass("active-filter-data")
    .attr("style", "color: blue;");

  $("*[rel=filter-data]").on("click", function(e) {
    var id = $(this).attr('data-target');

    $(".filter-data a")
      .removeClass("active-filter-data")
      .removeAttr("style");
    
    $(".filter-data a[data-target='"+id+"']")
    .addClass("active-filter-data")
    .attr("style", "color: blue;");

    filter();

  });
}

function buildLegend(){

  var ylegend = -width -margin.left + 20;

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + (50) + "," + ((margin.top+30) - (i * 20)) + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i){ return color(categories[(categories.length - 1) - i]);});

  legend.append("text")
    .attr("x", width + 10)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) { return categories[(categories.length - 1) - i]; });
}


d3.csv("./data/dataVisualization.csv", function(error, inputData) {
  if (error) alert("Problema para ler os dados de entrada!");

  data = inputData;

  processData();

  initializeCategories();
  buildFilterData();
  buildFilterCategories();
  buildVisualization();
  if(filterCategory == 0){
    buildLegend();
  }
  tooltip();
});

function processData(){
  radius = 10;

  names = [];
  ys = [];
  ids = [];
  dataFilter = [];

  if(filterCategory == 0){
    data.forEach(function(d, i) {
      dataFilter[i] = data[i];       
      d.avgAll = +d.avgAll;
      if (d.avgAll <= 0) { alert(d.name);}
      ys.push(d.avgAll);
      d.id = i;
      ids.push(i);
      d.rm = +d.rm;
    });
  }else{
    var index = 0;
    data.forEach(function(d, i) {   
      if(data[i].category == categories[(filterCategory - 1)]){
        dataFilter[index] = data[i];
        d.avgAll = +d.avgAll;
        if (d.avgAll <= 0) { alert(d.name);}
        ys.push(d.avgAll);
        d.id = i;
        ids.push(i);
        d.rm = +d.rm;
        index++;
      }
    });
  }
  sortData();
}

function sortData(){
  if(filterData == 0){
    dataFilter.sort(function (x, y) {
      return d3.ascending(x.name.toLowerCase(), y.name.toLowerCase());
    });
  }else{
    dataFilter.sort(function (x, y) {
      return (x.rm - y.rm);
    });
  }
}

window.addEventListener('resize', function(){
  var height = (window.innerHeight/1.5) - margin.top - margin.bottom;
  y.range([height, 0]);
  buildVisualization();
  if(filterCategory == 0){
    buildLegend();
  }
  tooltip();
});