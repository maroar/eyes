function filter(){
  name = $(".activeFilter").attr("data-target");
  filterData = $(".active-filter-data").attr("data-target");
  // if(name != filterCategory){
  	filterCategory = name;
  	processData();
    buildVisualization();
    if(filterCategory == 0){
      buildLegend();
    }
    tooltip();
    // tooltip([color(0), color(1), color(2)]);
    // console.log(name);
  // }
}
