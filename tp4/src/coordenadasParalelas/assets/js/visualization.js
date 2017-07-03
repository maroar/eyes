var click = false;
var all = true;
var dataBackup;
d3.csv("./data/data.csv", function(error, inputData) {
  if (error) alert("Problema para ler os dados de entrada!");

  dataBackup = inputData;
  var m = [80, 125, 200, 70],
    w = (d3.select("#mainCanvas").node().offsetWidth*.9) - m[1] - m[3],
    h = (window.innerHeight * 0.8) - m[0] - m[2]; //

  var line = d3.line(),
    axis = d3.axisLeft("left"),
    foreground;

  var svg = d3.select("#mainCanvas").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")

  color = d3.scaleOrdinal(d3.schemeCategory10);

  typesDuplicated = []; inputData.map(function(d) { typesDuplicated.push(d.category); });
  types = typesDuplicated.filter(function(item, pos) {
    return typesDuplicated.indexOf(item) == pos;
  });
  fields = Object.keys(inputData[0]);
  var fieldCategory = fields.pop();
  var fieldName = fields.shift();

  data = {};
  data[fieldCategory] = [];
  data[fieldName] = [];
  fields.forEach(function(d) { data[d] = []; });
  inputData.forEach(function(d, i) {
    data[fieldCategory].push(d[fieldCategory]);
    data[fieldName].push(d[fieldName]);
    d.id = i;
  });
  inputData.forEach(function(d) {
    fields.forEach(function(f) {
      data[f].push(+d[f]); 
    });
  });

  types.push('All');

  species = types; 
  traits = fields; 

  x = d3.scalePoint().domain(traits).range([0, w]);
  y = {};

  traits.forEach(function(d) {
    inputData.forEach(function(p) { p[d] = +p[d]; });

    y[d] = d3.scaleLinear()
      .domain(d3.extent(data[d]))
      .range([h, 0]);
  });

// Add a legend.
  var legend = svg.selectAll("g.legend")
    .data(species)
  .enter().append("svg:g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + (i * 20 + h*1.1) + ")"; })
  .on('click', handleTypes);

  legend.append("svg:line")
    .attr("stroke", function(d) { return color(d); })
    .attr("x2", 8);

  legend.append("svg:text")
    .attr("x", 12)
    .attr("dy", ".31em")
    .text(function(d) { return d; });

  // Add foreground lines.
  foreground = svg.append("svg:g")
    .attr("class", "foreground")
  .selectAll("path")
    .data(inputData)
  .enter().append("svg:path")
    .attr("class", "linePath")
    .attr("rel", "tooltip")
    .attr("data-target", "show")
    .attr("d", path)
    .attr("stroke", function(d) { return color(d.category); })
    .attr("id", function(d) { return "l" + d.id; })
    .style("opacity", 1)
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .on("click", handleClick);

  // Add a group element for each trait.
  var g = svg.selectAll(".trait")
    .data(traits)
  .enter().append("svg:g")
    .attr("class", "trait")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("svg:g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
  .append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", -11)
    .attr("fill", "black")
    .attr("font-size", 18)
    .text(String);

  function path(d) {
    return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  scatterGen("#div1", 5, 0);
  scatterGen("#div2", 5, 1);
  scatterGen("#div3", 5, 2);
  scatterGen("#div4", 5, 3);
  scatterGen("#div5", 5, 4);

  tooltip();
});

function addText(text) {
  d3.select("#mainText").node().innerHTML = text;
}

function handleMouseOver(d, i) {
  if (click)
    return;

  var obj = d3.select("#l" + i).node();
  if(obj.style.opacity == 0) {
    return;
  } 

  d3.selectAll('.linePath')
       .style("opacity", 0).attr("data-target", "hide");
  d3.select("#l" + i).style("opacity", 1).attr("data-target", "show");
}

function handleMouseOut(d, i) {
  if (click)
    return;

  var obj = d3.select("#l" + i).node();
  if(obj.style.opacity == 0) {
    return;
  } 

  if (all) {
    d3.selectAll('.linePath')
      .style("opacity", 1).attr("data-target", "show");
  } else
    handleTypes(d.category, i);
  }

function handleClick(d, i) {
  click = true;
  addText(d.project);
  d3.selectAll('.linePath')
    .style("opacity", 0).attr("data-target", "hide");
  d3.selectAll('.dot')
    .style("opacity", 0);

  d3.select("#l" + i).style("opacity", 1).attr("data-target", "show");
  d3.select("#c-0-" + i).style("opacity", 1).attr("data-target", "show");
  d3.select("#c-1-" + i).style("opacity", 1).attr("data-target", "show");
  d3.select("#c-2-" + i).style("opacity", 1).attr("data-target", "show");
  d3.select("#c-3-" + i).style("opacity", 1).attr("data-target", "show");
  d3.select("#c-4-" + i).style("opacity", 1).attr("data-target", "show");
}

function handleTypes(d, j) {
  click = false;
  addText("");
  if (d == "All") {
    all = true;
    d3.selectAll('.linePath')
       .style("opacity", 1).attr("data-target", "show");
       d3.selectAll('.dot')
       .style("opacity", 1);
    return;
  }

  all = false;
  for (i = 0; i < data.category.length; i++) {
    if (data.category[i] != d) {
      d3.select("#l" + i).style("opacity", 0).attr("data-target", "hide");
      d3.select("#c-0-" + i).style("opacity", 0).attr("data-target", "hide");
      d3.select("#c-1-" + i).style("opacity", 0).attr("data-target", "hide");
      d3.select("#c-2-" + i).style("opacity", 0).attr("data-target", "hide");
      d3.select("#c-3-" + i).style("opacity", 0).attr("data-target", "hide");
      d3.select("#c-4-" + i).style("opacity", 0).attr("data-target", "hide");
    } else {
      d3.select("#l" + i).style("opacity", 1).attr("data-target", "show");
      d3.select("#c-0-" + i).style("opacity", 1).attr("data-target", "show");
      d3.select("#c-1-" + i).style("opacity", 1).attr("data-target", "show");
      d3.select("#c-2-" + i).style("opacity", 1).attr("data-target", "show");
      d3.select("#c-3-" + i).style("opacity", 1).attr("data-target", "show");
      d3.select("#c-4-" + i).style("opacity", 1).attr("data-target", "show");
    }
  } 
}

function scatterGen(place, attr1, attr2) {
  var margin = {top: 50, right: 50, bottom: 40, left: 100},
    width = (d3.select(place).node().offsetWidth * .9) - margin.left - margin.right,
    height = width - margin.top - margin.bottom;

  var sx = d3.scaleLinear()
    .range([0, width]);

  var sy = d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom(sx);
  var yAxis = d3.axisLeft(sy);

  var svg = d3.select(place).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  coord1 = data[traits[attr1]];
  coord2 = data[traits[attr2]];

  sx.domain(d3.extent(coord1, function(d) { return d; })).nice();
  sy.domain(d3.extent(coord2, function(d) { return d; })).nice();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Sepal Width (cm)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Sepal Length (cm)");

  svg.selectAll(".dot")
    .data(coord1)
  .enter().append("circle")
    .attr("id", function(d, i) { return "c-" + attr2 + "-" + i; })
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d, i) { return sx(coord1[i]); })
    .attr("cy", function(d, i) { return sy(coord2[i]); })
    .style("fill", function(d, i) { return color(data.category[i]); })
  .on("click", handleClick);

  svg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate(" + (-50) +","+(height/2)+")rotate(-90)")  
    .text(traits[attr2]);

  svg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ (width/2) +","+ (height+30) +")") 
    .text(traits[attr1]);
}