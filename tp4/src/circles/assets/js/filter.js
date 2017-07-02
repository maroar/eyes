function filter(){
  filterCategory = $(".activeFilter").attr("data-target");
  filterData = $(".active-filter-data").attr("data-target");
  processData();
  buildVisualization();
  if(filterCategory == 0){
    buildLegend();
  }
  tooltip();
}
