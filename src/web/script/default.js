var domainAbiturnote = [0,5]
var thresholdsAbiturnote = [1,1.5,2,2.5,3,3.5,4]

/**
 * Creates a histogram of the given data for the given domain,
 * dividing the data into 8 classes/bins.
 */
function abiturnoteHistogram(data) {
  var result = []
  for (var i = 0; i <= thresholdsAbiturnote.length; i++) {
    result.push([])
    result[i]['x0'] = i > 0 ? thresholdsAbiturnote[i-1] : domainAbiturnote[0]
    result[i]['x1'] = i < thresholdsAbiturnote.length ? thresholdsAbiturnote[i]: domainAbiturnote[1]
    for (var j = 0; j < data.length; j++) {
      if (
        data[j].abiturnote >= domainAbiturnote[0] && data[j].abiturnote <= domainAbiturnote[1] &&
        (i <= 0 || data[j].abiturnote > thresholdsAbiturnote[i-1]) &&
        (i == thresholdsAbiturnote.length || data[j].abiturnote <= thresholdsAbiturnote[i])
      ) {
        result[i].push(data[j])
      }
    }
  }
  return result
}

function getTableCell(content) {
  var cell = document.createElement('td')
  cell.appendChild(document.createTextNode(content))
  return cell
}

function fillDatasetTable(data) {
  for (var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');
    row.appendChild(getTableCell(data[i].geschlecht == 1 ? 'w' : 'm'));
    row.appendChild(getTableCell(data[i].abiturnote));
    row.appendChild(getTableCell(data[i].bundesland));
    row.appendChild(getTableCell(data[i].fehlerArbeitsgedaechtnis));
    row.appendChild(getTableCell(data[i].studieninteresse));
    row.appendChild(getTableCell(data[i].leistungsanspruch));
    row.appendChild(getTableCell(data[i].prognoseStudienerfolg));
    row.appendChild(getTableCell(data[i].studienleistungModul1));
    document.querySelector('#data').appendChild(row);
  }
}

function fillAbiturnoteFreqTable(bins, numRows) {
  var cum = 0;
  for (var i = 0; i < bins.length; i++) {
    var row = document.createElement('tr')
    row.appendChild(getTableCell('(' + bins[i]['x0'] + ', ' + bins[i]['x1'] + ']'))
    row.appendChild(getTableCell(bins[i].length))
    row.appendChild(getTableCell((bins[i].length / numRows).toFixed(3)))
    row.appendChild(getTableCell((cum += bins[i].length / numRows).toFixed(3)))
    document.querySelector('#aufgabe1a_table table').appendChild(row)
  }
}

var fullWidth = 800;
var fullHeight = 500;
var margin = {top: 20, right: 20, bottom: 35, left: 35};
var width = fullWidth - margin.left - margin.right;
var height = fullHeight - margin.top - margin.bottom;

var x = d3.scaleLinear().domain(domainAbiturnote).range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("#aufgabe1a_histogram")
  .append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + (height+10) + ")")
  .call(d3.axisBottom(x));

var yAxis = svg.append("g")
  .attr("class", "axis axis--y")
  .attr("transform", "translate(-10,0)")
  .call(d3.axisLeft(y));

d3.csv("./data/lektion1/dataset_studienanfaenger.csv", function(error, data) {
  if (error) throw error;

  var bins = abiturnoteHistogram(data);

  fillDatasetTable(data);
  fillAbiturnoteFreqTable(bins, data.length);

  y.domain([0, d3.max(bins, function(d) { return d.length; })]);
  yAxis.call(d3.axisLeft(y));

  var bar = svg.selectAll(".bar")
    .data(bins)
    .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'
      });

  bar.append("rect")
    .attr("x", 1)
    .attr("y", 0)
    .attr("width", function(d) { return x(d.x1) - x(d.x0); })
    .attr("height", function(d) { return height - y(d.length); });

  bar.append("text")
      .attr("y", -5)
      .attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
      .attr("text-anchor", "middle")
      .text(function(d) { return d3.format(',.0f')(d.length); });
});
