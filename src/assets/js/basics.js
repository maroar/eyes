// global variables
var data;
var dataBackup;
var columnNames;
var columnOrder;
var typeOrder = "ascending";

//build the table header
function buildTableHeader(columns) {
  columnNames = columns;
  var thead = d3.select("body").select("table").select("thead");
  thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(d){
    return d;
  }).append("i").attr("class", "pull-right glyphicon glyphicon-sort").attr("data-model", function(d){
      return d;
  });
}

// build the table body
function buildTableBody(inputData, columns) {
  var tbody = d3.select('body').select('table').select('tbody');

  var rows = tbody.selectAll("tr").data(inputData).enter().append("tr");

  var cells = rows.selectAll("td").data(function(row){
    return columns.map(function(column) {
      row[column] = (row[column] != '') ? row[column] : "-";
      return {column: column, value: row[column]}
    })
  }).enter().append("td").text(function(d) {
  	return d.value;
  });
}

// load the csv data
d3.csv('data/dados-tp1.csv',function (inputData) {  
  dataBackup = inputData;
  data = dataBackup;
  buildTableHeader(d3.keys(data[0]));
  buildTableBody(data, columnNames);  
  d3.select("#searchTextId").on("input", function() {search(this.value);});
  d3.selectAll(".glyphicon-sort").on("click", function() {sortTable($(this)); });
})

// sorting function that defines whether the data will be sorted in ascending or descending order
function sortTable(headers){
  if(columnOrder == headers.attr("data-model")){
    if(typeOrder == 'ascending'){
      descendingTable(headers);
    }else{
      ascendingTable(headers);
    }
  }else{
    columnOrder = headers.attr("data-model");
    ascendingTable(headers);
  }
  cleanTable();
  buildTableBody(data, columnNames);
}

// sort the table data in ascending order
function ascendingTable(headers){
  data.sort(function(x, y) {
    var column = headers.attr("data-model");
    return (!isNaN(Number(x[column])) && !isNaN(Number(y[column]))) ? x[column]-y[column] : d3.ascending(x[column], y[column]);
  });
  typeOrder = "ascending";
  $('.glyphicon').removeClass().addClass('pull-right glyphicon glyphicon-sort');
  headers.removeClass('glyphicon-sort').addClass('glyphicon-sort-by-attributes');
}

// sort the table data in descending order
function descendingTable(headers){
  data.sort(function(x, y) {
    var column = headers.attr("data-model");
    return (!isNaN(Number(x[column])) && !isNaN(Number(y[column]))) ? y[column]-x[column] : d3.descending(x[column], y[column]);
  });
  typeOrder = "descending";
  $('.glyphicon').removeClass().addClass('pull-right glyphicon glyphicon-sort');
  headers.removeClass('glyphicon-sort').addClass('glyphicon-sort-by-attributes-alt');
}

// remove all rows from the table
function cleanTable() {
  var tableLength = document.getElementById("mainTable").rows.length;
  for (i = 0; i < tableLength-1; i++) {
    document.getElementById("mainTable").deleteRow(1);
  }
}

// search for pattern passed as parameter
function search(pattern) {
  cleanTable();
  if (!pattern) {
    buildTableBody(data, columnNames);
    return;
  }

  var res = [];
  data.forEach(function(d) { 
    columnNames.every(function(e) {
      if (d[e].includes(pattern)) {
        res.push(d);
        return false;
      } else 
        return true;
    });
  });
  buildTableBody(res, columnNames);
}