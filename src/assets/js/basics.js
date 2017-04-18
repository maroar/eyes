// variáveis globais
var dados;

// constrói o header da tabela
function buildTableHeader (columnNames) {
  table = d3.select("body").append("table").attr("border", 1);
  console.log(table);
  table.append("thead").append("tr").selectAll("th")
    .data(columnNames).enter().append("th").text(function (d) {
      return d;
  });
}

// constrói o corpo da tabela
function buildTableBody (data) {
  //
}

d3.csv('../../data/data.csv', function (data) {
  dados = data;
//  console.log(data);
//  console.log(dados);
});

var columnNames = ['city','state','population','land area']

buildTableHeader (columnNames);
