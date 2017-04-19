// variáveis globais
var data;
var columnNames;

// constrói o header da tabela
function buildTableHeader(columns) {
  columnNames = columns;
  var thead = d3.select("body").select("table").select("thead");
  thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(d){
    return d;
  });
}

// constrói o corpo da tabela
function buildTableBody(inputData, columns) {
  var tbody = d3.select('body').select('table').select('tbody');

  var rows = tbody.selectAll("tr").data(inputData).enter().append("tr");

  var cells = rows.selectAll("td").data(function(row){
    return columns.map(function(column) {
      return {column: column, value: row[column]}
    })
  }).enter().append("td").text(function(d) {
  	return d.value;
  });
}

// carrega os dados do csv
d3.csv('data/data.csv',function (inputData) {  
  data = inputData;
  buildTableHeader(d3.keys(data[0]));
  buildTableBody(data, columnNames);  
  d3.select("#searchTextId").on("input", function() {search(this.value);});
})

// remove all rows from the table
function cleanTable() {
  var tableLength = document.getElementById("mainTable").rows.length;
  for (i = 0; i < tableLength-1; i++) {
    document.getElementById("mainTable").deleteRow(1);
  }
}

// search for patter passed as parameter
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