
function showLine() {
  document.getElementById('displayLine').style.display = "block";
  document.getElementById('surface').style.display = "block";
  document.getElementById('displaySquare').style.display = "none";
  document.getElementById('displayPolygon').style.display = "none";
}

function showSquare() {
  document.getElementById('displayLine').style.display = "none";
  document.getElementById('displaySquare').style.display = "block";
  document.getElementById('surface').style.display = "block";
  document.getElementById('displayPolygon').style.display = "none";
}

function showPolygon() {
  document.getElementById('displayLine').style.display = "none";
  document.getElementById('displaySquare').style.display = "none";
  document.getElementById('displayPolygon').style.display = "block";
  document.getElementById('surface').style.display = "block";
}

function show_helpLine(){
  document.getElementById('display_helpLine').style.display = "block";
}

function show_helpSquare(){
  document.getElementById('display_helpSquare').style.display = "block";
}

function show_helpPolygon(){
  document.getElementById('display_helpPolygon').style.display = "block";
}