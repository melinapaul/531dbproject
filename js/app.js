var selected_day = "";
var selected_time = "";
var selected_city = "";

var selected_day_city = "";
var selected_time_city = "";
var selected_offence_city = "";

$("#day").change(function(){
  selected_day = $( "#day option:selected" ).text();
  drawPredict();
});

$("#city").change(function(){
  selected_city = $( "#city option:selected" ).text();
  drawPredict();
});

$("#time").change(function(){
  selected_time = $( "#time option:selected" ).text();
  drawPredict();
});

$("#day_city").change(function(){
  selected_day_city = $( "#day_city option:selected" ).text();
  drawPredictCity();
});

$("#offence_city").change(function(){
  selected_offence_city = $( "#offence_city option:selected" ).text();
  drawPredictCity();
});

$("#time_city").change(function(){
  selected_time_city = $( "#time_city option:selected" ).text();
  drawPredictCity();
});

init();



function init(){
  $( window ).load(function() {
    google.charts.load('current', {'packages':['gauge','corechart','map']});

    google.charts.setOnLoadCallback(drawChart);
  });
}


function drawChart() {
  drawPredict();
  drawPredictCity();

  $.get("http://ec2-54-209-48-230.compute-1.amazonaws.com/getDataAggregate.php", function( data ) {
    drawAggregateChart(data);
  });


}

function drawPredict() {

  $("#overlay").show();

  $.get("http://ec2-54-209-48-230.compute-1.amazonaws.com/getPrediction.php?day="+selected_day+"&time="+selected_time+"&city="+selected_city, function( data ) {
    //alert( "Load was performed." + data);

    var jsonData = JSON.parse(data);

    console.log(jsonData);
    $("#predicted_crime").text(jsonData.predictedLabel);

    $("#murder_meter").html("");
    var g_murder = new JustGage({
      id: "murder_meter",
      value: jsonData.predictedScores.Murder*100,
      min: 0,
      max: 100,
      width: 100,
      gaugeWidthScale: 0.3,
      levelColors: ["#e74c3c", "#e74c3c", "#e74c3c"],
      title: "Murder - " + parseFloat(jsonData.predictedScores.Murder).toFixed(2)*100 + "%"
    });

    $("#shooting_meter").html("");
    var g_shooting = new JustGage({
      id: "shooting_meter",
      value: jsonData.predictedScores.Shooting*100,
      min: 0,
      max: 100,
      width: 100,
      gaugeWidthScale: 0.3,
      levelColors: ["#e74c3c", "#e74c3c", "#e74c3c"],
      title: "Shooting - " + parseFloat(jsonData.predictedScores.Shooting).toFixed(2)*100 + "%"
    });

    $("#kidnap_meter").html("");
    var g_kidnap = new JustGage({
      id: "kidnap_meter",
      value: jsonData.predictedScores.Kidnap*100,
      min: 0,
      max: 100,
      width: 100,
      gaugeWidthScale: 0.3,
      levelColors: ["#e74c3c", "#e74c3c", "#e74c3c"],
      title: "Kidnap - " + parseFloat(jsonData.predictedScores.Kidnap).toFixed(2)*100 + "%"
    });

    $("#assault_meter").html("");
    var g_assault = new JustGage({
      id: "assault_meter",
      value: jsonData.predictedScores.Assault*100,
      min: 0,
      max: 100,
      width: 100,
      gaugeWidthScale: 0.3,
      levelColors: ["#e74c3c", "#e74c3c", "#e74c3c"],
      title: "Assault - " + parseFloat(jsonData.predictedScores.Assault).toFixed(2)*100 + "%"
    });

    $("#theft_meter").html("");
    var g_theft = new JustGage({
      id: "theft_meter",
      value: jsonData.predictedScores.Theft*100,
      min: 0,
      max: 100,
      width: 100,
      gaugeWidthScale: 0.3,
      levelColors: ["#e74c3c", "#e74c3c", "#e74c3c"],
      title: "Theft - " + parseFloat(jsonData.predictedScores.Theft).toFixed(2)*100 + "%"
    });

    $("#overlay").hide();

  });
}

function drawPredictCity() {

  $("#overlay").show();

  $.get("http://ec2-54-209-48-230.compute-1.amazonaws.com/getPredictionCity.php?day="+selected_day_city+"&time="+selected_time_city+"&offence="+selected_offence_city, function( data ) {
    //alert( "Load was performed." + data);

    var jsonData = JSON.parse(data);

    console.log(jsonData);

    $("#city_predicted").html(jsonData.predictedLabel + " - " + parseFloat(jsonData.predictedScores[jsonData.predictedLabel]).toFixed(2)*100 + "%");

    //$("#predicted_crime").text(jsonData.predictedLabel);


    $("#overlay").hide();

  });
}

function drawAggregateChart(data) {

    var jsonData = JSON.parse(data);
    var offence = [
      ['Offence', 'Occurance']
    ];

    console.log(jsonData);
    jQuery.each( jsonData.offence, function( i, val ) {
      offence.push([val.offence , parseInt(val.count)]);
    })

    var offenceData = google.visualization.arrayToDataTable(offence);

    var options = {
      title: 'Offences',
      is3D: false,
      width: '100%',
    };

    console.log(offenceData);

    var chart = new google.visualization.PieChart(document.getElementById('offence_chart'));
    chart.draw(offenceData, options);

    var time = [
      ['Time Of Day', 'Occurance']
    ];

    jQuery.each( jsonData.time, function( i, val ) {
      time.push([val.time_of_day , parseInt(val.count)]);
    })

    var timeData = google.visualization.arrayToDataTable(time);

    options = {
      title: 'Time',
      is3D: false,
      width: '100%',
    };

    chart = new google.visualization.BarChart(document.getElementById('time_chat'));
    chart.draw(timeData, options);

    var day = [
      ['Day', 'Occurance']
    ];

    jQuery.each( jsonData.day, function( i, val ) {
      day.push([val.day , parseInt(val.count)]);
    })

    var dayData = google.visualization.arrayToDataTable(day);

    options = {
      title: 'Day',
      is3D: false,
      orientation : 'vertical',
      width: '100%'
    };

    chart = new google.visualization.BarChart(document.getElementById('day_chart'));
    chart.draw(dayData, options);

    var city = [
      ['City', 'Occurance']
    ];

    jQuery.each( jsonData.city, function( i, val ) {
      city.push([val.city , parseInt(val.count)]);
    })

    var cityData = google.visualization.arrayToDataTable(city);

    options = {
      title: 'Number of crimes by city',
      is3D: false,
      width: '100%'
    };

    chart = new google.visualization.ColumnChart(document.getElementById('city_chart'));
    chart.draw(cityData, options);

    var mapdata = new google.visualization.DataTable();
      mapdata.addColumn('string', 'Address');
      mapdata.addColumn('string', 'Location');

      jQuery.each( jsonData.offence_by_city, function( i, val ) {
        var text = "";
        jQuery.each( val, function( j, o ) {
            text += o.offence + "-" + o.count + "<br>";
        });
        mapdata.addRows([[i + ", CA", text]]);
      });

      options = {
        mapType: 'styledMap',
        zoomLevel: 11,
        showTip: true,
        useMapTypeControl: true,
        width: '100%',
        maps: {
          // Your custom mapTypeId holding custom map styles.
          styledMap: {
            name: 'Styled Map', // This name will be displayed in the map type control.
            styles: [
              {featureType: 'poi.attraction',
               stylers: [{color: '#fce8b2'}]
              },
              {featureType: 'road.highway',
               stylers: [{hue: '#0277bd'}, {saturation: -50}]
              },
              {featureType: 'road.highway',
               elementType: 'labels.icon',
               stylers: [{hue: '#000'}, {saturation: 100}, {lightness: 50}]
              },
              {featureType: 'landscape',
               stylers: [{hue: '#259b24'}, {saturation: 10}, {lightness: -22}]
              }
        ]}}
      };


      var map = new google.visualization.Map(document.getElementById('map_chart'));

      console.log(map);

      map.draw(mapdata, options);

      $("#overlay").hide();
}
