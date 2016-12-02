/**
 * Creates a histogram of the given data for the given domain,
 * dividing the data into 8 classes/bins.
 */
function abiturnoteHistogram(domain, data) {
  var thresholds = [1,1.5,2,2.5,3,3.5,4]
  var result = []
  for (var i = 0; i <= thresholds.length; i++) {
    result.push([])
    result[i]['x0'] = i>0 ? thresholds[i-1] : domain[0]
    result[i]['x1'] = i < thresholds.length ? thresholds[i]: domain[1]
    for (var j = 0; j < data.length; j++) {
      if (
        data[j].abiturnote >= domain[0] && data[j].abiturnote <= domain[1] &&
        (i <= 0 || data[j].abiturnote > thresholds[i-1]) &&
        (i == thresholds.length || data[j].abiturnote <= thresholds[i])
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

d3.csv("./data/lektion1/dataset_studienanfaenger.csv", function(error, data) {
  for (var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');
    row.appendChild(getTableCell(data[i].geschlecht));
    row.appendChild(getTableCell(data[i].abiturnote));
    row.appendChild(getTableCell(data[i].bundesland));
    row.appendChild(getTableCell(data[i].fehlerArbeitsgedaechtnis));
    row.appendChild(getTableCell(data[i].studieninteresse));
    row.appendChild(getTableCell(data[i].leistungsanspruch));
    row.appendChild(getTableCell(data[i].prognoseStudienerfolg));
    row.appendChild(getTableCell(data[i].studienleistungModul1));
    document.querySelector('#data').appendChild(row);
  }
});
