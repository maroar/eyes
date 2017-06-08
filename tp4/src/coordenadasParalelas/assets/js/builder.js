var metrics; // considered metrics

// build the visualization with the readed before
function builVisualization() {
  console.log("it works!");
  
  init();
  /*
  buildAxis(data.map(function(d) { return d.country; }));

  data.forEach(function(d) {
    data_[d.country]["cx"] = x(d.country)+radius;
    data_[d.country]["cy"] = (metricToSort == null) ? y(data_[d.country]["avg"]) : y(data_[d.country][metricToSort]);
  });

  insertFlowers(data, data_, metrics);

  tooltip(data_, Object.keys(data[0]), countries_);
  */
}

// load the data and call the function to build the visualization
d3.csv("../data/teste.csv", function(error, data) {
  if (error) alert("Problema para ler os dados de entrada!");

  datacp = [];
  data.forEach(function(d) {
    datacp.push({ "name" : d.name, "stars" : +d.stars, "size" : +d.size});
  }); 

  builVisualization();

});

// ensures that when the size of the page changes the visualization is updated
window.addEventListener('resize', function(){
  //updateVisualization();
});