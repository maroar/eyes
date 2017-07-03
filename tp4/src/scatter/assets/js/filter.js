function filter(){
  filterCategory = $(".active-filter-category").attr("data-target");
  processData();
  buildVisualization();
  tooltip();
}