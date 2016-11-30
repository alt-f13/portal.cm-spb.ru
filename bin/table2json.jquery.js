var tbl = $('table tr').get().map(function(row) {
  return $(row).find('td').get().map(function(cell) {
    return $(cell).html().replace(/(\r\n|\n|\r)/gm,"").replace(/&nbsp;/, '').trim();
  });
});
tbl.splice(0,1);
var headers=tbl.splice(0,1);
console.log(tbl);
var newArray = tbl.map(function(col, i) {
  var _row={};
  //console.log(col, i);
  col.map(function(row, ci) {
    console.log(row, headers[0][ci]);
    _row[headers[0][ci]] = row;
  });
  return _row;
});
var cols=headers.map(function(col) {
  return {"name": col.toString()};
});
var arr=JSON.stringify({
  table: newArray,
  cols: cols,
});
console.log(headers, arr);
