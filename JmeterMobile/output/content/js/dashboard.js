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

    var data = {"OkPercent": 39.473684210526315, "KoPercent": 60.526315789473685};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2916666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "2 /"], "isController": false}, {"data": [0.0, 500, 1500, "3 /"], "isController": false}, {"data": [1.0, 500, 1500, "32 /safe_image.php"], "isController": false}, {"data": [0.0, 500, 1500, "4 /"], "isController": false}, {"data": [0.5, 500, 1500, "15 /international/shop/v5870/default/reactshop_5940_new_shop.zip"], "isController": false}, {"data": [0.0, 500, 1500, "8 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "14 /api/log"], "isController": false}, {"data": [1.0, 500, 1500, "27 /network_ads_common"], "isController": false}, {"data": [1.0, 500, 1500, "30 /safe_image.php"], "isController": false}, {"data": [1.0, 500, 1500, "1 /generate_204"], "isController": false}, {"data": [1.0, 500, 1500, "34 /safe_image.php"], "isController": false}, {"data": [0.0, 500, 1500, "37 /spi/v2/events"], "isController": false}, {"data": [0.0, 500, 1500, "17 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "5 /api/log"], "isController": false}, {"data": [1.0, 500, 1500, "11 /androidx/vps_v4_info.vpx"], "isController": false}, {"data": [0.0, 500, 1500, "22 /ping"], "isController": false}, {"data": [1.0, 500, 1500, "31 /safe_image.php"], "isController": false}, {"data": [0.0, 500, 1500, "20 /"], "isController": false}, {"data": [0.5, 500, 1500, "12 /androidx/avast-android-vps-v4-release.apk"], "isController": false}, {"data": [0.0, 500, 1500, "26 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "19 /"], "isController": false}, {"data": [0.0, 500, 1500, "18 /"], "isController": false}, {"data": [0.0, 500, 1500, "25 /spi/v2/events"], "isController": false}, {"data": [0.0, 500, 1500, "38 /api/log"], "isController": false}, {"data": [1.0, 500, 1500, "35 /errorlog/askv2"], "isController": false}, {"data": [0.0, 500, 1500, "24 /ping"], "isController": false}, {"data": [0.5, 500, 1500, "10 /androidx/avast-android-vps-v4-release.apk"], "isController": false}, {"data": [0.5, 500, 1500, "13 /androidx/avast-android-vps-v4-release.apk"], "isController": false}, {"data": [0.0, 500, 1500, "21 /v4.0/157771428000869/activities"], "isController": false}, {"data": [0.0, 500, 1500, "7 /api/log"], "isController": false}, {"data": [1.0, 500, 1500, "33 /safe_image.php"], "isController": false}, {"data": [0.0, 500, 1500, "36 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "6 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "16 /api/log"], "isController": false}, {"data": [0.0, 500, 1500, "28 /v4.0/157771428000869/activities"], "isController": false}, {"data": [1.0, 500, 1500, "9 /androidx/vps_v4_info.vpx"], "isController": false}, {"data": [0.0, 500, 1500, "23 /ping"], "isController": false}, {"data": [1.0, 500, 1500, "29 /safe_image.php"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38, 23, 60.526315789473685, 6195.000000000001, 11, 21013, 21006.2, 21013.0, 21013.0, 0.16139170616516316, 36.565772960093774, 0.03795475696744984], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["2 /", 1, 1, 100.0, 2274.0, 2274, 2274, 2274.0, 2274.0, 2274.0, 0.43975373790677225, 0.9099982135004397, 0.0], "isController": false}, {"data": ["3 /", 2, 2, 100.0, 4538.0, 2271, 6805, 6805.0, 6805.0, 6805.0, 0.29390154298310067, 1.2176536094783248, 0.0], "isController": false}, {"data": ["32 /safe_image.php", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 1881.4579133064517, 14.900453629032258], "isController": false}, {"data": ["4 /", 1, 1, 100.0, 2260.0, 2260, 2260, 2260.0, 2260.0, 2260.0, 0.4424778761061947, 0.9160674778761063, 0.0], "isController": false}, {"data": ["15 /international/shop/v5870/default/reactshop_5940_new_shop.zip", 1, 0, 0.0, 1393.0, 1393, 1393, 1393.0, 1393.0, 1393.0, 0.7178750897343863, 197.8348775125628, 0.1402099784637473], "isController": false}, {"data": ["8 /api/log", 1, 1, 100.0, 21000.0, 21000, 21000, 21000.0, 21000.0, 21000.0, 0.04761904761904762, 0.1111421130952381, 0.0], "isController": false}, {"data": ["14 /api/log", 2, 2, 100.0, 21008.0, 21008, 21008, 21008.0, 21008.0, 21008.0, 0.09520182787509521, 0.22219957873191165, 0.0], "isController": false}, {"data": ["27 /network_ads_common", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 2.232142857142857, 10.825020926339285, 8.2855224609375], "isController": false}, {"data": ["30 /safe_image.php", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 2004.0564903846155, 46.38671875], "isController": false}, {"data": ["1 /generate_204", 2, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 76.92307692307693, 8.037860576923077, 13.371394230769232], "isController": false}, {"data": ["34 /safe_image.php", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 11.11111111111111, 134.47265625, 4.00390625], "isController": false}, {"data": ["37 /spi/v2/events", 2, 2, 100.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 2.3866348448687353, 6.430396032219571, 0.0], "isController": false}, {"data": ["17 /api/log", 1, 1, 100.0, 21013.0, 21013, 21013, 21013.0, 21013.0, 21013.0, 0.047589587398277254, 0.111073353400276, 0.0], "isController": false}, {"data": ["5 /api/log", 2, 2, 100.0, 32424.0, 21013, 43835, 43835.0, 43835.0, 43835.0, 0.045625641610585146, 183.44230316813048, 0.023525721455457966], "isController": false}, {"data": ["11 /androidx/vps_v4_info.vpx", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 42.25852272727273, 17.844460227272727], "isController": false}, {"data": ["22 /ping", 1, 1, 100.0, 2001.0, 2001, 2001, 2001.0, 2001.0, 2001.0, 0.49975012493753124, 1.04000734007996, 0.0], "isController": false}, {"data": ["31 /safe_image.php", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 1787.9296875, 18.4765625], "isController": false}, {"data": ["20 /", 1, 1, 100.0, 2262.0, 2262, 2262, 2262.0, 2262.0, 2262.0, 0.44208664898320066, 0.916120965959328, 0.0], "isController": false}, {"data": ["12 /androidx/avast-android-vps-v4-release.apk", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 1.7035775127768313, 4561.7613394378195, 0.36267568143100515], "isController": false}, {"data": ["26 /api/log", 2, 2, 100.0, 21001.0, 21001, 21001, 21001.0, 21001.0, 21001.0, 0.09522902580706599, 0.2222630582801638, 0.0], "isController": false}, {"data": ["19 /", 1, 1, 100.0, 2263.0, 2263, 2263, 2263.0, 2263.0, 2263.0, 0.44189129474149363, 0.9165792090145825, 0.0], "isController": false}, {"data": ["18 /", 2, 2, 100.0, 29381.0, 2264, 56498, 56498.0, 56498.0, 56498.0, 0.03539948316754575, 4.851405829631138, 0.1333876033222415], "isController": false}, {"data": ["25 /spi/v2/events", 1, 1, 100.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 1.2547051442910915, 3.380597161229611, 0.0], "isController": false}, {"data": ["38 /api/log", 2, 2, 100.0, 21001.0, 21001, 21001, 21001.0, 21001.0, 21001.0, 0.09523356030665207, 0.22227364173134612, 0.0], "isController": false}, {"data": ["35 /errorlog/askv2", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 7.15188419117647, 12.063419117647058], "isController": false}, {"data": ["24 /ping", 1, 1, 100.0, 2001.0, 2001, 2001, 2001.0, 2001.0, 2001.0, 0.49975012493753124, 1.04000734007996, 0.0], "isController": false}, {"data": ["10 /androidx/avast-android-vps-v4-release.apk", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 1.5797788309636651, 4230.258935624012, 0.336320102685624], "isController": false}, {"data": ["13 /androidx/avast-android-vps-v4-release.apk", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 1.7921146953405018, 4798.842125896057, 0.381524417562724], "isController": false}, {"data": ["21 /v4.0/157771428000869/activities", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 12.048192771084338, 17.98992846385542, 0.0], "isController": false}, {"data": ["7 /api/log", 2, 2, 100.0, 32199.5, 21003, 43396, 43396.0, 43396.0, 43396.0, 0.04608719697667987, 6.511796882201124, 0.004500702829753895], "isController": false}, {"data": ["33 /safe_image.php", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 2208.550347222222, 25.661892361111114], "isController": false}, {"data": ["36 /api/log", 2, 2, 100.0, 21005.0, 21005, 21005, 21005.0, 21005.0, 21005.0, 0.09521542489883361, 0.2222313139728636, 0.0], "isController": false}, {"data": ["6 /api/log", 1, 1, 100.0, 21006.0, 21006, 21006, 21006.0, 21006.0, 21006.0, 0.047605446063029605, 0.11111036727601638, 0.0], "isController": false}, {"data": ["16 /api/log", 1, 1, 100.0, 21003.0, 21003, 21003, 21003.0, 21003.0, 21003.0, 0.04761224586963767, 0.11112623791839261, 0.0], "isController": false}, {"data": ["28 /v4.0/157771428000869/activities", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 8.333333333333334, 12.443033854166668, 0.0], "isController": false}, {"data": ["9 /androidx/vps_v4_info.vpx", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 17.216435185185187, 7.269965277777778], "isController": false}, {"data": ["23 /ping", 1, 1, 100.0, 2003.0, 2003, 2003, 2003.0, 2003.0, 2003.0, 0.4992511233150275, 1.0389688904143783, 0.0], "isController": false}, {"data": ["29 /safe_image.php", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 2321.22802734375, 28.86962890625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: emcqipxxcfmw", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, 8.695652173913043, 5.2631578947368425], "isController": false}, {"data": ["Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\jmeter mobile\\sa_4324a55c-517e-46ce-969d-1648caef7c3e_1580473892624.tap (The system cannot find the file specified)", 2, 8.695652173913043, 5.2631578947368425], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ucxtxvpl", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}, {"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, 43.47826086956522, 26.31578947368421], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: efvatbm", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ywvlcyq", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}, {"data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 3, 13.043478260869565, 7.894736842105263], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: atpazxsirsc", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: iuwhhkwife", 1, 4.3478260869565215, 2.6315789473684212], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38, 23, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 3, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\jmeter mobile\\sa_4324a55c-517e-46ce-969d-1648caef7c3e_1580473892624.tap (The system cannot find the file specified)", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: emcqipxxcfmw", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["2 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: efvatbm", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["3 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: atpazxsirsc", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["4 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ucxtxvpl", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["8 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["14 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 /spi/v2/events", 1, 1, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\jmeter mobile\\sa_4324a55c-517e-46ce-969d-1648caef7c3e_1580473892624.tap (The system cannot find the file specified)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["5 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["22 /ping", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["20 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: iuwhhkwife", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["26 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: emcqipxxcfmw", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 /", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ywvlcyq", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["25 /spi/v2/events", 1, 1, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: D:\\jmeter mobile\\sa_4324a55c-517e-46ce-969d-1648caef7c3e_1580473892624.tap (The system cannot find the file specified)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["24 /ping", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["21 /v4.0/157771428000869/activities", 1, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["7 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["36 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["6 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 /api/log", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 /v4.0/157771428000869/activities", 1, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["23 /ping", 1, 1, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
