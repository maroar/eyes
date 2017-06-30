var y01z;
var yMax;
var y1Max;

function buildGraph(d) {
  y01z = d3.stack().keys(d3.range(number_colors))(d3.transpose(v));
  perc = d3.stack().keys(d3.range(number_colors))(d3.transpose(percentage));
  yMax = d3.max(v, function(y) { return d3.max(y); });
  y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

  xAxis = d3.axisBottom(x).tickSize(0);
  yAxis = d3.axisLeft(y);

  x.domain(projects);
  if(typeChart==0) {
    y.domain([0, y1Max]);
  } else {
    y.domain([0, 1]);
    yAxis.tickFormat(d3.format(".0%"));
  }

  var data_series = (typeChart == 0) ? y01z : perc;

  d3.selectAll("svg").remove();

  var svg = d3.select("#mbars").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top);

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var series = g.selectAll(".series")
    .data(data_series)
    .enter().append("g")
    .attr("fill", function(d, i) { return color(i); })

  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", height)
    .attr("class", "bar")
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("data-target", function(d, i) {return "p"+i; })
    .attr("rel", "tooltip")
    .on("mouseover", function() {
      d3.selectAll(".bar").attr("opacity", 0.1);
      var selector = '[data-target=' + d3.select(this).attr("data-target") + ']';
      $(selector).attr("opacity", 1);
    }).on("mouseout", function() {
      d3.selectAll(".bar").attr("opacity", 1);
    });

  if(d == 0){
    rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });
  }else{
    rect.attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });
  }

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
      .selectAll("text").remove();

  g.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + (margin.left + 20) + "," + ((margin.top + 40) - (i * 20)) + ")"; });

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
    .text(function(d) { return legends[d]; });

  var textY = g.append("text")
      .attr("text-anchor", "middle")  
      .attr("transform", "translate(" + (-35) +","+(height/2)+")rotate(-90)");

  if(typeChart == 0){    
    textY.text("Amount Deprecated Elements");
  }else{
    textY.text("Percentage Deprecated Elements ");
  }

  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width/2) +","+ (height+60) +")")  // centre below axis
      .text("Projects");

  // Add a legend.
  // var legend2 = svg.selectAll("legend2")
  //     .data(categories)
  //   .enter().append("g")
  //     .attr("class", "legend2")
  //     .attr("transform", function(d, i) { return "translate(0," + (i * 20 + height*1.1) + ")"; });

  // legend2.append("line")
  //     .attr("stroke", function(d) { console.log(color(d)); return color(d); })
  //     .attr("x2", 8);

  // legend2.append("text")
  //     .attr("x", 12)
  //     .attr("dy", ".31em")
  //     .text(function(d) { return d; });

  // divOption.rem

  // d3.selectAll("#filters").clear();
  

  // divOption.append("a")
  //   .attr("class", "btn btn-large active")
  //   .attr("data-toggle", "tab")
  //   // .attr("data-model", "alphabetical")
  //   .text("alphabetical");

  // divOption
  // .data(categories).enter()
  // .append("a")
  // .attr("class", "btn btn-large")
  // .attr("data-toggle", "tab")
  // // .attr("data-model", "metrics-mean")
  // .append("text")
  //   .attr("x", 12)
  //   .attr("dy", ".31em")
  //   .text(function(d){ console.log(d); return "ok"} );

  // legend2.append("text")
  //     .attr("x", 12)
  //     .attr("dy", ".31em")
  //     .text(function(d) { return d; });


}

function buildFilter(){
  var divOptionChart = d3.select("body")
    .select("#filterChart")
    .append("div")
    .attr("class", "btn-group legend3")
    .attr("data-toggle", "buttons-radio");

  divOptionChart.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filterChart")
      .attr("class", "btn btn-large")
      .attr("data-target", 0)
      .text("Absolute");

  divOptionChart.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filterChart")
      .attr("class", "btn btn-large")
      .attr("data-target", 1)
      .text("Relative");

  var divOptionData = d3.select("body")
    .select("#filterData")
    .append("div")
    .attr("class", "btn-group legend2")
    .attr("data-toggle", "buttons-radio");  

  categories.forEach(function(m, i) {
    divOptionData.append("a")
      .attr("data-toggle", "tab")
      .attr("rel", "filterCategory")
      .attr("class", "btn btn-large")
      .attr("data-target", i)
      .text(m);
  }); 

  $(".legend3 a[data-target='0']")
    .addClass("activeOptionChart")
    .attr("style", "color: blue;");

  $(".legend2 a[data-target='0']")
    .addClass("activeOptionCategory")
    .attr("style", "color: red;");

  $("*[rel=filterChart]").on("click", function(e) {
    var id = $(this).attr('data-target');

    $(".legend3 a")
      .removeClass("activeOptionChart")
      .removeAttr("style");
    
    $(".legend3 a[data-target='"+id+"']")
    .addClass("activeOptionChart")
    .attr("style", "color: blue;");

    processData();
    buildGraph(0);
    tooltip([color(0), color(1), color(2)]);

  });

  $("*[rel=filterCategory]").on("click", function(e) {
    var id = $(this).attr('data-target');

    $(".legend2 a")
      .removeClass("activeOptionCategory")
      .removeAttr("style");
    
    $(".legend2 a[data-target='"+id+"']")
    .addClass("activeOptionCategory")
    .attr("style", "color: red;");

    processData();
    buildGraph(0);
    tooltip([color(0), color(1), color(2)]);

  });
}

d3.csv("./data/dataVisualization.csv", function(error, inputData) {
  if (error) { 
    alert("problem reading data!");
    return ; 
  }
  data = inputData;
  initializeCategories();

  buildFilter();
  processData();
  buildGraph(0);
  tooltip([color(0), color(1), color(2)]);
});

window.addEventListener('resize', function(){
  width = (d3.select("#mbars").node().offsetWidth*.9) - margin.left - margin.right,
  height = (window.innerHeight * 0.8) - margin.top - margin.bottom;
  x.rangeRound([0, width]);
  y.range([height, 0]);
  buildGraph(1);
  tooltip([color(0), color(1), color(2)]);
});