function handleMouseOver(d, i) { 
  d3.selectAll("circle").style("opacity", 0);
  d3.select("#c" + i).style("opacity", 1).attr("fill", function(d) { return color(d.category); }).attr("r", radius*2);
}

function handleMouseOut(d, i) {
  d3.selectAll("circle").style("opacity", 1);
  d3.select("#c" + i).transition().delay(50).attr("r", function() { return radius; }).on("end", function(a) { this.setAttribute("fill", "black"); d3.select("#t-" + d.id).remove(); });
}

function buildVisualization(){

  width = (d3.select("#mainCanvas").node().offsetWidth) - margin.left - margin.right;
  side = Math.min(width, height);

  y.range([side, 0])
   .domain(d3.extent(rm));

  x.range([0, width - margin.right])
   .domain(d3.extent(ed));

  d3.selectAll("svg").remove();

  svg = d3.select("#mainCanvas").append("svg")
      .attr("width", width)
      .attr("height", side + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + side + ")")
    .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
    .call(yAxis);

  svg.append("text")
      .attr("text-anchor", "middle")  
      .attr("transform", "translate(" + (-50) +","+(side/2)+")rotate(-90)")  
      .text("% Replacement Messages");

  svg.append("text")
      .attr("text-anchor", "middle")  
      .attr("transform", "translate("+ (side/2) +","+ (side+30) +")")  
      .text("% Deprecated Elements");

  circles = svg.append("g").selectAll("circle")
    .data(dataFilter)
    .enter()
    .append("circle")
      .attr("rel", "tooltip")
      .attr("cx", function(d) { return x(d.ed); })
      .attr("cy", function(d) { return y(d.rm); })
      .attr("r", function(d) { return radius; })
      .attr("id", function(d, i) { return "c" + i; })
      .attr("fill", "black")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}

function buildFilterCategories(){

  var divOptionData = d3.select("body")
    .select("#filterCategory")
    .append("div")
    .attr("class", "btn-group filter-category")
    .attr("data-toggle", "buttons-radio");  

  divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter-category")
      .attr("class", "btn btn-large")
      .attr("data-target", 0)
      .text("All");

  categories.forEach(function(m, i) {
    divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filter-category")
      .attr("class", "btn btn-large")
      .attr("data-target", (i + 1))
      .text(m);
  }); 

  $(".filter-category a[data-target='0']")
    .addClass("active-filter-category")
    .attr("style", "color: red;");

  $("*[rel=filter-category]").on("click", function(e) {
    var id = $(this).attr('data-target');

    $(".filter-category a")
      .removeClass("active-filter-category")
      .removeAttr("style");
    
    $(".filter-category a[data-target='"+id+"']")
    .addClass("active-filter-category")
    .attr("style", "color: red;");

    filter();

  });
}

function processData(){
  rm = [];
  ed = [];
  dataFilter = [];

  if(filterCategory == 0){
    data.forEach(function(d, i) {   
      dataFilter[i] = d;      
      ed.push(+d.ed);
      rm.push(+d.rm);
      d.id = i;
    });
  }else{
    var index = 0;
    data.forEach(function(d, i) {
      if(d.category == categories[filterCategory - 1]){
        dataFilter[index] = d;  
        ed.push(+d.ed);
        rm.push(+d.rm);
        d.id = i;
        index++;
      }
    });
  }
}

d3.csv("./data/dataVisualization.csv", function(error, inputData) {
  if (error) alert("Problema para ler os dados de entrada!");

  data = inputData;
  radius = 3;

  processData();
  initializeCategories();
  buildFilterCategories();
  buildVisualization();
  tooltip();
});

window.addEventListener('resize', function(){
  var height = (window.innerHeight/1.5) - margin.top - margin.bottom;
  buildVisualization();
  tooltip();
});
