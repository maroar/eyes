// global variables
var data;
var dataBackup;
var columnNames;
var columnOrder;
var typeOrder = "ascending";
var page = 1;
var totalPages;
var limitByPage;

// build the table header.
function buildTableHeader(columns) {
    columnNames = columns;
    var thead = d3.select("body").select("table").select("thead");
    thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function (d) {
        return d;
    }).append("i").attr("class", "pull-right glyphicon glyphicon-sort").attr("data-model", function (d) {
        return d;
    });
}

// build the table body.
function buildTableBody(inputData, columns) {

    if (inputData.length == 0) {
        document.getElementById('msg').style.display = 'block';
        return;
    }
    var tbody = d3.select('body').select('table').select('tbody');

    var rows = tbody.selectAll("tr").data(inputData).enter().append("tr");

    var cells = rows.selectAll("td").data(function (row) {
        return columns.map(function (column) {
            row[column] = (row[column] != '') ? row[column] : "-";
            return {column: column, value: row[column]}
        })
    }).enter().append("td").text(function (d) {
        return d.value;
    });
           document.getElementById('msg').style.display = 'none';
}

// load the csv data.
d3.csv('data/data.csv', function (inputData) {
    dataBackup = inputData;
    data = dataBackup;
    limitByPage =
            buildTableHeader(d3.keys(data[0]));
    limitByPage = document.getElementById("limitRecords").value;
    defineLimitPagination(limitByPage);
    d3.select("#searchTextId").on("input", function () {
        search(this.value);
    });
    d3.selectAll(".glyphicon-sort").on("click", function () {
        sortTable($(this));
    });
    d3.select("#limitRecords").on('change', function () {
        defineLimitPagination(this.value);
    });
    d3.select("#prev").on("click", function () {
        previousPage();
    });
    d3.select("#next").on("click", function () {
        nextPage();
    });

    sizeScroll();
})

// sorting function that defines whether the data will be sorted in ascending or descending order.
function sortTable(headers) {
    if (columnOrder == headers.attr("data-model")) {
        if (typeOrder == 'ascending') {
            descendingTable(headers);
        } else {
            ascendingTable(headers);
        }
    } else {
        columnOrder = headers.attr("data-model");
        ascendingTable(headers);
    }
    repaintBody(getDataByLimit(data));
}

// sort the table data in ascending order.
function ascendingTable(headers) {
    data.sort(function (x, y) {
        var column = headers.attr("data-model");
        return (!isNaN(Number(x[column])) && !isNaN(Number(y[column]))) ? x[column] - y[column] : d3.ascending(x[column].toLowerCase(), y[column].toLowerCase());
    });
    typeOrder = "ascending";
    $('.glyphicon').removeClass().addClass('pull-right glyphicon glyphicon-sort');
    headers.removeClass('glyphicon-sort').addClass('glyphicon-sort-by-attributes');
}

// sort the table data in descending order.
function descendingTable(headers) {
    data.sort(function (x, y) {
        var column = headers.attr("data-model");
        return (!isNaN(Number(x[column])) && !isNaN(Number(y[column]))) ? y[column] - x[column] : d3.descending(x[column].toLowerCase(), y[column].toLowerCase());
    });
    typeOrder = "descending";
    $('.glyphicon').removeClass().addClass('pull-right glyphicon glyphicon-sort');
    headers.removeClass('glyphicon-sort').addClass('glyphicon-sort-by-attributes-alt');
}

// remove all rows from the table.
function cleanTable() {
    var tableLength = document.getElementById("mainTable").rows.length;
    for (i = 0; i < tableLength - 1; i++) {
        document.getElementById("mainTable").deleteRow(1);
    }
}

// search for pattern passed as parameter.
function search(pattern) {
    page = 1;
    resetSorting();
    if (!pattern) {
        data = dataBackup;
        pagination(data);
        return;
    }

    var res = [];
    dataBackup.forEach(function (d) {
        columnNames.every(function (e) {
            if (d[e].includes(pattern)) {
                res.push(d);
                return false;
            } else
                return true;
        });
    });
    data = res;
    pagination(data);
}

// clears the sort order when the search feature is activated.
function resetSorting() {
    $('.glyphicon').removeClass().addClass('pull-right glyphicon glyphicon-sort');
    typeOrder = "ascending";
    columnOrder = "";
}

// this function creates an array with the limit specified.
function getDataByLimit(d) {
    var res = [];
    var start = (d[(limitByPage * page) - limitByPage] != null) ? ((limitByPage * page) - limitByPage) : 0;
    var i = 0;
    while (((i + start) < d.length) && (i < limitByPage)) {
        res.push(d[i + start]);
        i++;
    }
    return res;
}

// this function updates the paging bound according to the value specified by the user.
function defineLimitPagination(limitRecords) {
    limitByPage = (limitRecords != '' && limitRecords > 0) ? limitRecords : 1;
    document.getElementById("limitRecords").value = limitByPage;
    page = 1;
    pagination(data);
}

// this function performs the pagination on table.
function pagination(d) {
    totalPages = ((d.length % limitByPage) == 0) ? parseInt(d.length / limitByPage) : parseInt(d.length / limitByPage) + 1;
    totalPages = (totalPages == 0) ? 1 : totalPages;
    var res = getDataByLimit(d);
    repaintBody(res);
    d3.select("body").select("#infoPage").select("a").text("Showing " + page + " to " + totalPages + " pages");
    updateButtons()
}

// updates the data in the table.
function repaintBody(data) {
    cleanTable();
    buildTableBody(data, columnNames);
    sizeScroll();
}

// this function returns a page in the table.
function previousPage() {
    if (page > 1) {
        page--;
        pagination(data);
    }
}

// this function advances one page in the table.
function nextPage() {
    if (page < totalPages) {
        page++;
        pagination(data);
    }
}

// refresh the paging button states.
function updateButtons() {
    if (page > 1 && page < totalPages) {
        $('#prev').removeClass('disabled');
        $('#next').removeClass('disabled');
    } else if (totalPages == 1) {
        $('#prev').addClass('disabled');
        $('#next').addClass('disabled');
    } else if (page == totalPages) {
        $('#prev').removeClass('disabled');
        $('#next').addClass('disabled');
    } else if (page == 1) {
        $('#prev').addClass('disabled');
        $('#next').removeClass('disabled');
    }
}

function sizeScroll() {

    if (data.length == 0) {
        return;
    }

    // change the selector if needed
    var $table = $('#mainTable'),
            $bodyCells = $table.find('tbody tr:first').children(),
            colWidth;

    // adjust the width of thead cells when window resizes
    var larger = 95;
    $(window).resize(function () {

        // get the tbody columns width array
        colWidth = $bodyCells.map(function () {
            return $(this).width();
        }).get();

        for (var i = 0; i < colWidth.length; i++) {
            if (colWidth[i] >= larger) {
                larger = (larger <= 90) ? colWidth[i] : 95;
            }
        }

        // set the width of thead columns
        $table.find('thead th').children().each(function (i, v) {
            $(v).width(colWidth[i]);
        });

        // set the width of thead columns
        $table.find('tbody tr').children().each(function (i, v) {
            $(v).width(larger);
        });

    }).resize();

}