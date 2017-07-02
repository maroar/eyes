function handleMouseOver(d, i) {  
  d3.selectAll("circle").attr("opacity", 0.1);
  d3.select("#c" + i).attr("opacity", 1);
  d3.select("#c" + i).attr("fill", function(d) { return color(d.category); }).attr("r", radius*2);

  // svg.append("text")
  //     .attr("id", "t-" + d.id)
  //     .attr("x", function() { return x(d.id); }) 
  //     .attr("y", function() { return y(d.avgAll) - 15; })
  //   .text(function() {
  //     return d.name; 
  //   });
}

function handleMouseOut(d, i) {
  d3.select("#c" + i).transition().delay(200).attr("r", function() { return (d.rm/100)*radius; }).on("end", function(a) { this.setAttribute("fill", "none") });

  // d3.select("#t-" + d.id).remove();

  d3.selectAll("circle").attr("opacity", 1);

}


function buildVisualization(){
  d3.selectAll("svg").remove();

  if(filterData == 0){
    margin.right = 300;
  }else {
    margin.right = 50;
  }
  width = (d3.select("#mainCanvas").node().offsetWidth) - margin.left - margin.right;
  
  x.range([0, width]);

  x.domain(d3.extent(ids));

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
        .attr("cx", function(d) { return x(d.id); })
        .attr("cy", function(d) { return y(d.avgAll); })
        .attr("r", function(d) { return (d.rm/100)*radius; })
        .attr("id", function(d, i) { return "c" + i; })
        .attr("stroke", function(d) { return color(d.category); })
        .attr("fill", "none")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
}

function buildFilter(){

  var divOptionData = d3.select("body")
    .select("#filterData")
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
    // processData();
    // buildGraph(0);
    // tooltip([color(0), color(1), color(2)]);

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
    .style("fill", color);

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

  // x.domain(d3.extent(ids));

  // y.domain(d3.extent(ys));

  initializeCategories();
  buildFilter();
  buildVisualization();
  if(filterData == 0){
    buildLegend();
  }
  tooltip();
});

function processData(){
  radius = 10;
  // t = d3.transition()
  //   .duration(500)
  //   .ease(d3.easeLinear);

  names = [];
  ys = [];
  ids = [];
  dataFilter = [];

  if(filterData == 0){
    data.forEach(function(d, i) {
      dataFilter[i] = data[i];        
      // names.push(d.name);
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
      if(data[i].category == categories[(filterData - 1)]){
        dataFilter[index] = data[i];
        // names.push(d.name);
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
}

window.addEventListener('resize', function(){
  // width = (d3.select("#mbars").node().offsetWidth*.9) - margin.left - margin.right,
  height = (window.innerHeight * 0.8) - margin.top - margin.bottom;
  // x.rangeRound([0, width]);
  y.range([height, 0]);
  buildVisualization();
  if(filterData == 0){
    buildLegend();
  }
  tooltip();
});