var metrics; // considered metrics

// build the visualization with the readed before
function builVisualization() {
  d3.selectAll("svg").remove();

  init();

  buildAxis(data.map(function(d) { return d.country; }));

  data.forEach(function(d) {
    data_[d.country]["cx"] = x(d.country)+radius;
    data_[d.country]["cy"] = (metricToSort == null) ? y(data_[d.country]["avg"]) : y(data_[d.country][metricToSort]);
  });

  insertFlowers(data, data_, metrics);

  tooltip(data_, Object.keys(data[0]), countries_);
}

// load the data and call the function to build the visualization
d3.csv("./data/data.csv", function(error, inputData) {
  if (error) alert("Problema para ler os dados de entrada!");

  data = inputData; 

  inputData.forEach(function(m, i) {
    Object.keys(m).forEach(function(d){
      var key = d.replace("-", " ");
      data[i][key] = inputData[i][d];
    })
  });                

  d3.json("./data/countries.json", function(error2, json) {
    if (error2) alert("Problema para ler os dados sobre os países!");

    countries = json;

    metrics = ["housing", "income", "jobs", "community", "education", "environment", "civic engagement", "health", "life satisfaction", "safety", "work life balance"];

    createOptionsSort();

    processData(metrics.length);

    builVisualization();
  });
});

// ensures that when the size of the page changes the visualization is updated
window.addEventListener('resize', function(){
  builVisualization();
});