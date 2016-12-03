const domainAbiturnote = [0,5]
const thresholdsAbiturnote = [1,1.5,2,2.5,3,3.5,4]

var dataset;
var bars;

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

function getTableCell(content, row = null, col = null, isEditable = false) {
  var cell = document.createElement('td')
  cell.appendChild(document.createTextNode(content))
  if (isEditable) {
    cell.setAttribute("contenteditable", true);
    cell.addEventListener('keydown', editableListener)
    cell.addEventListener('blur', editableListener)
    cell.dataset.row = row
    cell.dataset.col = col
  }
  return cell
}

function fillDatasetTable(data) {
  for (var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');
    row.appendChild(getTableCell(data[i].geschlecht == 1 ? 'w' : 'm'));
    row.appendChild(getTableCell(data[i].abiturnote, i, 'abiturnote', true));
    row.appendChild(getTableCell(data[i].bundesland));
    row.appendChild(getTableCell(data[i].fehlerArbeitsgedaechtnis));
    row.appendChild(getTableCell(data[i].studieninteresse));
    row.appendChild(getTableCell(data[i].leistungsanspruch));
    row.appendChild(getTableCell(data[i].prognoseStudienerfolg));
    row.appendChild(getTableCell(data[i].studienleistungModul1));
    document.querySelector('#data tbody').appendChild(row);
  }
}

function fillAbiturnoteFreqTable(bins, numRows) {
  document.querySelector('#aufgabe1a_table table tbody').innerHTML = ""
  var cum = 0;
  for (var i = 0; i < bins.length; i++) {
    var row = document.createElement('tr')
    row.appendChild(getTableCell('(' + bins[i]['x0'] + ', ' + bins[i]['x1'] + ']'))
    row.appendChild(getTableCell(bins[i].length))
    row.appendChild(getTableCell((bins[i].length / numRows).toFixed(3)))
    row.appendChild(getTableCell((cum += bins[i].length / numRows).toFixed(3)))
    document.querySelector('#aufgabe1a_table table tbody').appendChild(row)
  }
}

function editableListener(event) {
  if (event.which == 13 /* enter key */ || event.type == 'blur') {
    if (event.target.innerHTML.match(/^[0-9]+\.[0-9]+$/)) {
      console.log("Value matches")
      dataset[event.target.dataset.row][event.target.dataset.col] = Math.min(domainAbiturnote[1], Math.max(domainAbiturnote[0], parseFloat(event.target.innerHTML)))
      updateDiagrams()
    }
    event.target.innerHTML = (dataset[event.target.dataset.row][event.target.dataset.col] + '').length <= 1
      ? dataset[event.target.dataset.row][event.target.dataset.col].toFixed(1)
      : dataset[event.target.dataset.row][event.target.dataset.col]
    event.target.blur()
    event.preventDefault()
  }
}

var fullWidth = 800;
var fullHeight = 500;
var margin = {top: 20, right: 20, bottom: 35, left: 80};
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

svg.append("text")
  .attr('class', 'y label')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height/2)
  .attr('y', -65)
  .text('Absolute Häufigkeitsdichte')

d3.csv("./data/lektion1/dataset_studienanfaenger.csv", function(error, data) {
  if (error) throw error;
  dataset = data
  fillDatasetTable(data);
  updateDiagrams();
})

function updateDiagrams() {
  var bins = abiturnoteHistogram(dataset);
  fillAbiturnoteFreqTable(bins, dataset.length);

  y.domain([0, d3.max(bins, function(d) { return d.length / (d.x1 - d.x0); })]);

  if (bars == null) {
    yAxis.call(d3.axisLeft(y));
    bars = svg.selectAll('.bar').data(bins)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length / (d.x1 - d.x0)) + ')'
      });

    bars.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .attr("height", function(d) { return height - y(d.length / (d.x1 - d.x0)); });

    bars.append("text")
      .attr("y", -5)
      .attr("x", function(d) { return (x(d.x1) - x(d.x0)) / 2; })
      .attr("text-anchor", "middle")
      .text(function(d) { return d3.format(',.0f')(d.length); });
  } else {
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
    bars = svg.selectAll('.bar').data(bins).transition().duration(1000)
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length / (d.x1 - d.x0)) + ')'
      })
    svg.selectAll('.bar rect').data(bins).transition().duration(1000)
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .attr("height", function(d) { return height - y(d.length / (d.x1 - d.x0)); });
    svg.selectAll('.bar text').data(bins)
      .text(function(d) { return d3.format(',.0f')(d.length); })
  }
}
