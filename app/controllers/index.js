var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"

d3.select("#title-box").style("width","100%")

var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var buckets = colors.length;

var margin = {
  top: 50,
  right: 20,
  bottom: 20,
  left: 50
}

var width = 600;
var height = 10000;

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
    points.push([hexRadius * j * 1.75 + 50, hexRadius * i * 1.5 + 50]);
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

var div = d3.select("#box").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
}).on("mouseover", function(d, i) {
      div.transition()
        .duration(100)
        .style("opacity", 0.8);
      div.html("<span class='year'>" + newData[i].year + " - " + month[newData[i].month - 1] + "</span><br>" +
          "<span class='temperature'>" + (Math.floor((newData[i].variance + baseTemp) * 1000) / 1000) + " &#8451" + "</span><br>" +
          "<span class='variance'>" + newData[i].variance + " &#8451" + "</span>")
        .style("left", (d3.event.pageX - ($('.tooltip').width()/2)) + "px")
        .style("top", (d3.event.pageY - 75) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", 0);
    });


})


