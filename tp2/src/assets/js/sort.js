function createOptionsSort() {
  var divOption = d3.select("body")
    .select("#sort")
    .append("div").attr("class", "btn-group").attr("data-toggle", "buttons-radio");

  divOption.append("a")
    .attr("class", "btn btn-large btn-primary active")
    .attr("data-toggle", "tab")
    .attr("data-model", "alphabetical")
    .text("alphabetical")
    .on("click", function(){
      sortVisualization("alphabetical")
    });

  divOption.append("a")
  .attr("class", "btn btn-large btn-primary")
  .attr("data-toggle", "tab")
  .attr("data-model", "metrics-mean")
  .text("metrics mean")
  .on("click", function(){
    sortVisualization("metrics-mean")
  });

  metrics.forEach(function(m, i) {
    divOption.append("a")
      .attr("class", "btn btn-large btn-primary")
      .attr("data-toggle", "tab")
      .attr("data-model", m)
      .text(m)
      .on("click", function(){
        sortVisualization(m)
      });;
  });       

}

function sortVisualization(type){
  if(type == 'alphabetical'){
    sortByAphabetical();
  } else if(type == "metrics-mean"){
    sortByMean();
  } else{
    sortByMetric(type);
  }
  $(".btn.btn-large.btn-primary").removeClass("active");
  $("[data-model='" + type + "]'").addClass("active");        
  builVisualization();
}

function sortByAphabetical(){
  metricToSort = null;
  data.sort(function (x, y) {
    return d3.ascending(countries_[x["country"]].pt, countries_[y["country"]].pt);
  });
}

function sortByMean(){
  metricToSort = null;
    data.sort(function (x, y) {
    return (data_[x.country].avg - data_[y.country].avg);
  });
}

function sortByMetric(metric){
  metricToSort = metric;
  data.sort(function (x, y) {
    return (data_[x.country][metric] - data_[y.country][metric]);
  });
}