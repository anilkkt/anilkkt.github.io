var slidesCount = 0
var today = new Date();
var datestring = `${today.getFullYear()}-${("0"+(today.getMonth()+1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

document.getElementById('nextDate').value = datestring;

function addContentControl() {
  slidesCount++;
  const label = document.createElement("label");
  label.setAttribute("for", `song${slidesCount}`);
  label.innerText = `Song ${slidesCount}: `;

  const input = document.createElement("textarea");
  input.setAttribute("name", `song${slidesCount}`);
  input.setAttribute("id", `lyrics${slidesCount}`);

  const div = document.createElement("div");
  addTableRow('tblSongsList', label, input, div)
}

function addUrlControl() {
  slidesCount++;

  const label = document.createElement("label");
  label.setAttribute("for", `song${slidesCount}`);
  label.innerText = `Song ${slidesCount}: `;

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", `song${slidesCount}`);
  input.setAttribute("id", `song${slidesCount}`);

  const button = document.createElement("button");
  button.setAttribute("id", `btnSong${slidesCount}`);
  button.setAttribute("type", "button");
  button.setAttribute("onclick", `getSong('${slidesCount}')`);
  button.innerText = 'Get Lyrics';

  const input2 = document.createElement("textarea");
  input2.setAttribute("name", `song${slidesCount}`);
  input2.setAttribute("id", `lyrics${slidesCount}`);
  input2.setAttribute("value", `Song ${slidesCount}`);

  const div = document.createElement("div");
  addTableRow('tblSongsList', label, input, button)
  addTableRow('tblSongsList', div, input2, div)
}

function addTableRow(tableId, col1, col2, col3) {

  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");

  const table = document.getElementById(tableId);

  td1.appendChild(col1)
  td2.appendChild(col2)
  td3.appendChild(col3)
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  table.appendChild(tr);
}

function generateSlides() {
  for(let i=0;i<slidesCount;i++) {
    $.ajax({ url: 'www.google.com', success: function(data) { return data } });
  }
}

function appendSlides(){
}

function getSong(id){
  const url = document.getElementById(`song${id}`).value;
  
  $.ajax({ url: url, success: function(data) {
    const htmlDom = new DOMParser().parseFromString(data, 'text/html');
    document.getElementById(`lyrics${id}`).value = htmlDom.innerText; 
    //document.getElementById(`lyrics${id}`).value = htmlDom.getElementsByClassName('ui-tabs-panel ui-corner-bottom ui-widget-content')[0].innerText; 
    } 
  });
}
