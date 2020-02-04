/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 37.5, "KoPercent": 62.5};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2857142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 /generate_204"], "isController": false}, {"data": [1.0, 500, 1500, "41 /poly/config/levInit"], "isController": false}, {"data": [0.0, 500, 1500, "51 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "54 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "47 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "46 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "43 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "49 /api/log"], "isController": false}, {"data": [0.5, 500, 1500, "40 /poly/config/levInit"], "isController": false}, {"data": [0.0, 500, 1500, "45 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "48 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "50 /api/log"], "isController": false}, {"data": [1.0, 500, 1500, "53 /generate_204"], "isController": false}, {"data": [0.0, 500, 1500, "44 /api/log"], "isController": false}, {"data": [0.5, 500, 1500, "42 /nc/app/wifi/ok.html"], "isController": false}, {"data": [1.0, 500, 1500, "52 /generate_204"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16, 10, 62.5, 13268.437500000002, 8, 21018, 21008.9, 21018.0, 21018.0, 0.0753590150576732, 0.13694238008496729, 0.020546186539466927], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["39 /generate_204", 2, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 125.0, 13.0615234375, 21.728515625], "isController": false}, {"data": ["41 /poly/config/levInit", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 3.5211267605633805, 8.978185519366198, 6.447375660211268], "isController": false}, {"data": ["51 /api/log", 2, 2, 100.0, 21002.0, 21002, 21002, 21002.0, 21002.0, 21002.0, 0.09522449173927534, 0.22225247583678523, 0.0], "isController": false}, {"data": ["54 /api/log", 2, 2, 100.0, 21003.0, 21003, 21003, 21003.0, 21003.0, 21003.0, 0.09522449173927534, 0.22225247583678523, 0.0], "isController": false}, {"data": ["47 /api/log", 2, 2, 100.0, 21005.0, 21005, 21005, 21005.0, 21005.0, 21005.0, 0.09521542489883361, 0.2222313139728636, 0.0], "isController": false}, {"data": ["46 /api/log", 1, 1, 100.0, 21002.0, 21002, 21002, 21002.0, 21002.0, 21002.0, 0.047614512903532996, 0.1111315291400819, 0.0], "isController": false}, {"data": ["43 /api/log", 2, 2, 100.0, 31505.5, 21004, 42007, 42007.0, 42007.0, 42007.0, 0.04761111243364201, 0.16668538874473304, 0.0], "isController": false}, {"data": ["49 /api/log", 2, 2, 100.0, 21018.0, 21018, 21018, 21018.0, 21018.0, 21018.0, 0.0951520053285123, 0.22208329368666446, 0.0], "isController": false}, {"data": ["40 /poly/config/levInit", 2, 0, 0.0, 769.0, 627, 911, 911.0, 911.0, 911.0, 2.1953896816684964, 8.3988662870472, 6.029817851262349], "isController": false}, {"data": ["45 /api/log", 2, 2, 100.0, 31502.0, 21001, 42003, 42003.0, 42003.0, 42003.0, 0.04761564650144037, 0.16670126240982788, 0.0], "isController": false}, {"data": ["48 /api/log", 2, 2, 100.0, 21000.0, 21000, 21000, 21000.0, 21000.0, 21000.0, 0.09523809523809525, 0.2222842261904762, 0.0], "isController": false}, {"data": ["50 /api/log", 2, 2, 100.0, 21002.0, 21002, 21002, 21002.0, 21002.0, 21002.0, 0.09522449173927534, 0.22225247583678523, 0.0], "isController": false}, {"data": ["53 /generate_204", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 13.0615234375, 21.728515625], "isController": false}, {"data": ["44 /api/log", 1, 1, 100.0, 21003.0, 21003, 21003, 21003.0, 21003.0, 21003.0, 0.04761224586963767, 0.11112623791839261, 0.0], "isController": false}, {"data": ["42 /nc/app/wifi/ok.html", 2, 0, 0.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 1.7730496453900708, 0.5696614583333334, 0.31686336436170215], "isController": false}, {"data": ["52 /generate_204", 2, 0, 0.0, 198.0, 194, 202, 202.0, 202.0, 202.0, 9.900990099009901, 1.551864170792079, 2.581605816831683], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, 100.0, 62.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["54 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["49 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["45 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["50 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["44 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
