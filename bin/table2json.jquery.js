var tbl = $('table tr').get().map(function(row) {
  return $(row).find('td').get().map(function(cell) {
    return $(cell).html().replace(/(\r\n|\n|\r)/gm,"").replace(/&nbsp;/, '').trim();
  });
});
var newArray = tbl.map(function(col, i) {
  return tbl.map(function(row) {
    return row[i]
  })
});
var arr=JSON.stringify(newArray);
