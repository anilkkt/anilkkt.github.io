var gItems = [];
var gSelections = [];

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
  return JSON.parse(data);
}

function addCartItems() {
  var cartItems = readSelection("shopping-list");
  var cartList = document.getElementById('cartList');

  if (cartItems && cartItems.length == 0) {
    cartList.innerHTML = '<p>Cart is empty, user next tab..</p>';
    return
  }

  cartList.innerHTML = '';
  var br = document.createElement('br');
  cartList.appendChild(br);

  cartItems.forEach(item => {
    var div = getCartItemDiv(item);
    cartList.appendChild(div);
  });

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

  var shopList = readSelection('shopping-list');

  clearItems();
  gItems = [];
  itemList.forEach(item => {
    item.id = item.name.replace(/\s/g, '');
    var option = getItemOption(`opt${item.id}`, item.name);
    items.appendChild(option);
    gItems.push(item);

    var shopItem = shopList.find(itm => itm.id === item.id);
    if (shopItem) {
      updateSelectionItem(item);
    }
  });
}

function getItemOption(id, value) {
  var option = document.createElement('option');
  option.setAttribute('id', id);
  option.setAttribute('value', value);
  return option;
}

function getItemDiv(item) {
  var div = document.createElement('div');
  if (item) {
    var div1 = document.createElement('div');
    div1.setAttribute('id', `bt${item.id}`);
    //div1.setAttribute('type', 'button');
    div1.classList.add('collapsible');
    div1.innerText = item.name;

    var button = document.createElement('button');
    button.setAttribute('id', `rm${item.id}`);
    button.setAttribute('type', 'button');
    button.classList.add('right');
    button.innerHTML = '<i class="fa fa-close"></i>';
    button.addEventListener('click', function () {
      removeItemDiv(`bt${item.id}`);
    });

    var div2 = document.createElement('div');
    div2.classList.add('itemcontent');
    var p = document.createElement('p');
    p.innerText = `${item.name} - ${item.measure} - ${item.stores.split(',')[0]}`

    div1.addEventListener("click", function () {
      collapseItemDiv(`bt${item.id}`);
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content) {
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      }
    });

    div1.appendChild(button);
    div2.appendChild(p);
    div.appendChild(div1);
    div.appendChild(div2);
  }
  return div;
}


function getCartItemDiv(item) {
  var div = document.createElement('div');
  if (item) {
    var div1 = document.createElement('div');
    div1.setAttribute('id', `bt${item.id}`);
    //div1.setAttribute('type', 'button');
    div1.classList.add('collapsible');

    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', `chk${item.id}`);
    checkbox.setAttribute('value', item.name);
    checkbox.classList.add('largerCheckbox');
    checkbox.checked = item.checked;
    checkbox.addEventListener('click', function () {
      toggleSelection(item.id, this.checked, 'shopping-list');
      addCartItems();
    });

    var label = document.createElement('label');
    label.setAttribute('for', `chk${item.id}`);
    label.classList.add('largerCheckbox');
    label.innerText = item.name;

    var label2 = document.createElement('label');
    label2.classList.add('right');
    label2.innerText = item.stores.split(',')[0];

    div1.appendChild(checkbox);
    div1.appendChild(label);
    div1.appendChild(label2);
    div.appendChild(div1);
  }
  return div;
}

function updateSelectionItem(item) {
  var itemList = document.getElementById('itemList');
  var itemDiv = getItemDiv(item);
  if (itemList.childElementCount == 0) {
    itemList.appendChild(itemDiv);
  }
  else {
    itemList.insertBefore(itemDiv, itemList.firstChild);
  }
  var selectedOption = document.getElementById(`opt${item.id}`);
  selectedOption.remove();
}

function addSelectionItem(textbox) {
  var itemList = document.getElementById('itemList');
  var item = gItems.find(item => item.name === textbox.value);
  console.log(JSON.stringify(item));

  var itemDiv = getItemDiv(item);
  if (itemList.childElementCount == 0) {
    itemList.appendChild(itemDiv);
  }
  else {
    itemList.insertBefore(itemDiv, itemList.firstChild);
  }
  textbox.value = '';
  console.log(`opt${item.id}`);
  var selectedOption = document.getElementById(`opt${item.id}`);
  selectedOption.remove();
  saveSelection({
    id: item.id,
    name: item.name,
    stores: item.stores,
    checked: false
  }, "shopping-list");
}

function removeSelectionItem(textbox) {
  var itemList = document.getElementById('itemList');
  var item = gItems.find(item => item.name === textbox.value);
  var itemDiv = getItemDiv(item);
  if (itemList.childElementCount == 0) {
    itemList.appendChild(itemDiv);
  }
  else {
    itemList.insertBefore(itemDiv, itemList.firstChild);
  }
  //readSelection(item.id, "shopping-list");
  textbox.value = '';
  var selectedOption = document.getElementById(`opt${item.id}`);
  selectedOption.remove();
}

function removeItemDiv(id) {
  var itemid = id.replace('bt', '');
  var items = document.getElementById('items');
  var item = gItems.find(item => item.id === itemid);
  var option = getItemOption(`opt${item.id}`, item.name);
  console.log(items.childElementCount);
  items.appendChild(option);
  console.log(items.childElementCount);

  var div = document.getElementById(id);
  div.parentElement.remove();

  removeSelection(item.id, 'shopping-list');
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
    addStores();
  }
  else if (tabName === 'edit') {
    addItems();
  }
  else if (tabName === 'cart') {
    addCartItems();
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

function clearItems() {
  var itemList = document.getElementById('itemList');
  while (itemList.lastElementChild) {
    itemList.removeChild(itemList.lastElementChild);
  }
  var items = document.getElementById('items');
  items.innerHTML = '';
}

function saveSelection(obj, name) {
  var data = localStorage.getItem(name);
  if (!data) {
    data = '[]';
  }
  var shopList = JSON.parse(data);
  var item = shopList.find(itm => itm.id === obj.id);
  if(item) {
    shopList.splice(shopList.findIndex(itm => itm.id === obj.id), 1);
  }
  shopList.unshift(obj);
  localStorage.setItem(name, JSON.stringify(shopList));
}

function removeSelection(id, name) {
  var data = localStorage.getItem(name);
  var shopList = JSON.parse(data);
  
  shopList.splice(shopList.findIndex(itm => itm.id === id), 1);
  localStorage.setItem(name, JSON.stringify(shopList));
}

function toggleSelection(id, checked, name) {
  var data = localStorage.getItem(name);
  var shopList = JSON.parse(data);
  var item = shopList.find(itm => itm.id === id);
  item.checked = checked;
  localStorage.setItem(name, JSON.stringify(shopList));
}

function clearSelection(name) {
  localStorage.setItem(name, JSON.stringify([]));
}

function readSelection(name) {
  var data = localStorage.getItem(name);
  var list = JSON.parse(data);
  list.sort( compareCheck );
  return list;
}

function compareCheck(a, b) {
  if (a.checked) {
    return 1;
  }
  if (b.checked) {
    return -1;
  }
  return 0;
}

