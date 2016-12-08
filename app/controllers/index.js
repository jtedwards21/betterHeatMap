var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"

var margin = {
  top: 50,
  right: 20,
  bottom: 20,
  left: 50
}

var width = 850;
var height = 350;

d3.json(url, function(data){

var yearData = data.monthlyVariance.map(function(d){
  return d.year;
})

var years = [];

var filterYears = function(d){
  var index = years.indexOf(d);
  if(index == -1){
    years.push(d);
    return true;
  } else {
    return false;
  }
}

//filter out the duplicate years
var filteredYearData = yearData.filter(filterYears);


var MapColumns = filteredYearData.length;
var MapRows = 12;

var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
   height/((MapRows + 1/3) * 1.5)]);

//Calculate the center positions of each hexagon

var points = [];
for(var i = 0; i < MapRows; i++) {
  for (var j = 0; j < MapColumns; j++) {
    points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
  }//for j
}//for i


console.log(points);



})


