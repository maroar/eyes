function filter(){
  name = $(".activeFilter").attr("data-target");
  if(name != filterData){
  	filterData = name;
  	processData();
    buildVisualization();
    if(filterData == 0){
      buildLegend();
    }
    tooltip();
    // tooltip([color(0), color(1), color(2)]);
    // console.log(name);
  }
}