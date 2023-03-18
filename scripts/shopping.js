var gItems;

function httpGet(theUrl) {
  let xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.open("GET", theUrl, false);
  xmlHttpReq.send(null);
  return xmlHttpReq.responseText;
}

function getStores() {
  var data = httpGet('https://anilkkt.github.io/data/stores.json');
  return JSON.parse(data);
}

function getItems() {
  var data = httpGet('https://anilkkt.github.io/data/items.json');
  gItems = JSON.parse(data);
  return gItems;
}

function getRadio(id, name, val) {
  var radio = document.createElement('input');
  radio.setAttribute('type', 'radio');
  radio.setAttribute('id', id);
  radio.setAttribute('name', name);
  radio.setAttribute('value', val);
  return radio;
}

function getLabelFor(id) {
  var label = document.createElement('label');
  label.setAttribute('id', id);
  label.innerText = id;
  return label;
}

function addItems() {
  var items = document.getElementById('items');
  var itemList = getItems();

  if (items.childElementCount > 3) {
    return;
  }

  itemList.forEach(item => {
    item.id = item.name.replace(/\s/g, '');
    var option = document.createElement('option');
    option.setAttribute('id', `opt${item.id}`);
    option.setAttribute('value', item.name);
    items.appendChild(option);
  });
}

function getItemDiv(item) {
  var div = document.createElement('div');
  if (item) {
    var button = document.createElement('button');
    button.setAttribute('id', `bt${item.id}`);
    button.setAttribute('type', 'button');
    button.classList.add('collapsible');
    button.innerText = item.name;
    var div2 = document.createElement('div');
    div2.classList.add('itemcontent');
    var p = document.createElement('p');
    p.innerText = `${item.name} - ${item.measure} - ${item.stores.split(',')[0]}`

    button.addEventListener("click", function () {
      collapseItemDiv(`bt${item.id}`);
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });

    div2.appendChild(p);
    div.appendChild(button);
    div.appendChild(div2);
  }
  return div;
}

function addSelectionItem(textbox) {
  var itemList = document.getElementById('itemList');
  var item = gItems.find(item => item.name === textbox.value);
  var itemDiv = getItemDiv(item);
  if (itemList.childElementCount == 0) {
    itemList.appendChild(itemDiv);
  }
  else {
    itemList.insertBefore(itemDiv, itemList.firstChild);
  }
  textbox.value = '';
  var selectedOption = document.getElementById(`opt${item.id}`);
  selectedOption.remove();
}

function addStores() {
  var stores = document.getElementById('stores');
  var storeList = getStores();

  if (stores.childElementCount > 3) {
    return;
  }

  var radio = getRadio('allStores', 'stores', 'All Stores');
  var label = getLabelFor('allStores');
  var br = document.createElement('br');

  radio.setAttribute('checked', 'true');
  stores.appendChild(radio);
  stores.appendChild(label);
  stores.appendChild(br);

  storeList.forEach(store => {
    radio = getRadio(store.name, 'stores', store.name);
    label = getLabelFor(store.name);
    br = document.createElement('br');

    stores.appendChild(radio);
    stores.appendChild(label);
    stores.appendChild(br);
  });
}

function refresh() {
  location.reload();
}

function selectTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  if (tabName === 'stores') {
    addStores()
  }
  else if (tabName === 'edit') {
    addItems()
  }
}

function collapseItemDiv(val) {
  var collapsibleItems = document.getElementsByClassName("collapsible");
  for (var i = 0; i < collapsibleItems.length; i++) {
    var item = collapsibleItems[i];
    if(item.classList.contains('active') && item.id !== val) {
      item.classList.toggle("active");
      var content = item.nextElementSibling;
      content.style.display = "none";
    }
  }
}
