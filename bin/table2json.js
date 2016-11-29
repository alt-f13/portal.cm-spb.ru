#!/usr/local/bin/node
var dir = '_docs/';
var fs = require('fs');
var path = require('path');
var fsc = require("fs-cheerio");

var dataFiles;
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

console.log(process.env.HOME);
walk(process.env.HOME+"/dev/scheduler/_docs", function(err, results) {
  if (err) throw err;
  var dataFiles=results.filter(function(name) {
    return name.match(/data/);
  });
  console.log(dataFiles);
  dataFiles.forEach(function(file) {
    console.log(file, this);
    fsc.readFile(file, function(err, $){
      // $ is a jquery/cheerio object that can be manipulated.
      console.log(err);
      //$("tr").map(function(row) {
      //  console.log(row.html());
        //return
      //});
    });
  //  let $ = cheerio.load(file);

  });
});
