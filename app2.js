const database = firebase.database();
var lightValues = [];
var humidityValues = [];
var temperatureValues = [];
var heatValues = [];
var table = "";
var count = 0;


function placeD(){
  console.log(JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.min);
  document.getElementById("name").value=JSON.parse(localStorage.getItem("n2MaxMin")).Nombre
  document.getElementById("description").value=JSON.parse(localStorage.getItem("n2MaxMin")).Descripcion
  document.getElementById("lMin").value=JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.min
  document.getElementById("lMax").value=JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.max
  document.getElementById("huMin").value=JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.min
  document.getElementById("huMax").value=JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.max
  document.getElementById("tMin").value=JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.min
  document.getElementById("tMax").value=JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.max
  document.getElementById("hMin").value=JSON.parse(localStorage.getItem("n2MaxMin")).Heat.min
  document.getElementById("hMax").value=JSON.parse(localStorage.getItem("n2MaxMin")).Heat.max
}

function upNave(){
      var name=document.getElementById("name").value
      var desc=document.getElementById("description").value
      var tma=document.getElementById("tMax").value
      var tmi=document.getElementById("tMin").value
      var hma=document.getElementById("hMax").value
      var hmi=document.getElementById("hMin").value
      var huma=document.getElementById("huMax").value
      var humi=document.getElementById("huMin").value
      var lma=document.getElementById("lMax").value
      var lmi=document.getElementById("lMin").value
      var valores={
        Nombre: name,
        Descripcion: desc,
        Temperature:{
          min: tmi,
          max: tma
        },
        Heat:{
          min:hmi,
          max: hma
        },
        Humidity:{
          min:humi,
          max:huma
        },
        Light_V:{
          min: lmi,
          max: lma
        }

      }

      database.ref("/").update(valores);
      localStorage.setItem("n2MaxMin",JSON.stringify(valores));
      placeMinMax();
}

var valores= JSON.parse(localStorage.getItem("n2MaxMin"))
database.ref("/").update(valores);

function placeMinMax(){

document.getElementById("miL").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.min
document.getElementById("maL").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.max
document.getElementById("miHu").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.min
document.getElementById("maHu").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.max
document.getElementById("miT").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.min
document.getElementById("maT").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.max
document.getElementById("miH").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Heat.min
document.getElementById("maH").innerHTML=JSON.parse(localStorage.getItem("n2MaxMin")).Heat.max

}

function getData() {
  database.ref("/Relay").on("value", (snapshot) => {
      console.log(snapshot.node_.value_);
      document.getElementById("relays").innerHTML= snapshot.node_.value_

  });
  database.ref("/Nombre").on("value", (snapshot) => {
    document.getElementById('h1').innerHTML =  snapshot.node_.value_;
  });
  database.ref("/Descripcion").on("value", (snapshot) => {
    document.getElementById('descripcion').innerHTML =  snapshot.node_.value_;
  });
  database.ref("/Light_V").on("value", (snapshot) => {
    console.log(snapshot);
    if(parseFloat(snapshot.node_.children_.root_.right.value.value_)>=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.max)||parseFloat(snapshot.node_.children_.root_.right.value.value_)<=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Light_V.min)){
      document.getElementById("alerta-luz").style.display="block"
    }else{
      document.getElementById("alerta-luz").style.display="none"
    }
    count++;
    Draw();
    lightValues.push([count, snapshot.node_.children_.root_.right.value.value_]);
    table += `<tr><td>${count}</td>
            <td>${snapshot.node_.children_.root_.right.value.value_}</td>`;
    document.getElementById("tbody").innerHTML = table;
    document.getElementById("light").innerText = "Light: " + snapshot.node_.children_.root_.right.value.value_;

    database.ref("/Humidity").once("value", (snapshot) => {
      if(parseFloat(snapshot.node_.children_.root_.right.value.value_)>=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.max)||parseFloat(snapshot.node_.children_.root_.right.value.value_)<=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Humidity.min)){
        document.getElementById("alerta-hu").style.display="block"
      }else{
        document.getElementById("alerta-hu").style.display="none"
      }
      humidityValues.push([count, snapshot.node_.children_.root_.right.value.value_]);
      table += `
                <td>${snapshot.node_.children_.root_.right.value.value_}</td>`;
      document.getElementById("tbody").innerHTML = table;
      document.getElementById("humidity").innerText = "Humidity: " + snapshot.node_.children_.root_.right.value.value_;

    });

    database.ref("/Temperature").once("value", (snapshot) => {
      if(parseFloat(snapshot.node_.children_.root_.right.value.value_)>=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.max)||parseFloat(snapshot.node_.children_.root_.right.value.value_)<=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Temperature.min)){
        document.getElementById("alerta-t").style.display="block"
      }else{
        document.getElementById("alerta-t").style.display="none"
      }
      temperatureValues.push([count, snapshot.node_.children_.root_.right.value.value_]);
      table += `
                <td>${snapshot.node_.children_.root_.right.value.value_}</td>`;
      document.getElementById("tbody").innerHTML = table;
      document.getElementById("temperature").innerText = "Temperature: " + snapshot.node_.children_.root_.right.value.value_;
    });

    database.ref("/Heat").once("value", (snapshot) => {
      if(parseFloat(snapshot.node_.children_.root_.right.value.value_)>=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Heat.max)||parseFloat(snapshot.node_.children_.root_.right.value.value_)<=parseFloat(JSON.parse(localStorage.getItem("n2MaxMin")).Heat.min)){
        document.getElementById("alerta-h").style.display="block"
      }else{
        document.getElementById("alerta-h").style.display="none"
      }
      heatValues.push([count, snapshot.node_.children_.root_.right.value.value_]);
      table += `
                <td>${snapshot.node_.children_.root_.right.value.value_}</td>
            </tr>`;
      document.getElementById("tbody").innerHTML = table;
      document.getElementById("heat").innerText = "Heat: " + snapshot.node_.children_.root_.right.value.value_;
    });
  });
}

google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(drawCurveTypes);

function Draw(){
    drawCurveTypes();
    drawBasic();
    draw();
    drawHeat();
}

function drawCurveTypes() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "X");
  data.addColumn("number", "Light Volts");

  data.addRows(lightValues);

  var options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Value",
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("lightChart")
  );

  chart.draw(data, options);
}

google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "X");
  data.addColumn("number", "Humidity");

  data.addRows(humidityValues);

  var options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "value",
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("humidityChart")
  );

  chart.draw(data, options);
}

google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(draw);

function draw() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "X");
  data.addColumn("number", "Temperature (°C)");

  data.addRows(temperatureValues);

  var options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "value",
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("temperatureChart")
  );

  chart.draw(data, options);
}


google.charts.load("current", { packages: ["corechart", "line"] });
google.charts.setOnLoadCallback(drawHeat);

function drawHeat() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "X");
  data.addColumn("number", "Temperature (°C)");

  data.addRows(heatValues);

  var options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "value",
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("heatChart")
  );

  chart.draw(data, options);
}