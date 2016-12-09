var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"

var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

var buckets = colors.length;

var margin = {
  top: 50,
  right: 20,
  bottom: 20,
  left: 50
}

var width = 850;
var height = 4050;

d3.json(url, function(data){

var baseTemp = data.baseTemperature;

var temperatureData = data.monthlyVariance;

var varianceData = temperatureData.map(function(obj) {
    return obj.variance;
  });

var lowVariance = d3.min(varianceData);
var highVariance = d3.max(varianceData);

var colorScale = d3.scaleQuantile()
    .domain([lowVariance + baseTemp, highVariance + baseTemp])
    .range(colors);

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

var MapColumns = 12;
var MapRows = filteredYearData.length;


var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
   height/((MapRows + 1/3) * 1.5)]);

//Calculate the center positions of each hexagon

var points = [];
for(var i = 0; i < MapRows; i++) {
  for (var j = 0; j < MapColumns; j++) {
    points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
  }//for j
}//for i

points.pop();
points.pop();
points.pop();

//Map to a new set of data with all the written points as well
var newData = points.map(function(d,i){
    var t = {};
    t.x = d[0];
    t.y = d[1];
    t.year = temperatureData[i].year;
    t.month = temperatureData[i].month;
    t.variance = temperatureData[i].variance;
    return t;
})

console.log(newData);

var chart = d3.select("#chart")

chart.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var hexbin = d3_hexbin.hexbin();

hexbin.radius(hexRadius);

chart.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
  return "M" + d.x + "," + d.y + hexbin.hexagon();
 })
    .attr("stroke", "white")
    .attr("stroke-width", "1px")
    .style("fill", function(d, i){
	console.log(i);
	return colorScale(newData[i].variance + baseTemp);
});


})


