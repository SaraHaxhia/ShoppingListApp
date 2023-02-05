/*
class NewListItem {
  constructor(item,quantity,type){
    this.item=item;
    this.quantity=quantity;
    this.type=type; 
  }

  addToList() {
    liveShoppingList.push(this);

  }
}*/



let liveShoppingList = [];
let shoppingListDatabase = [];

function newListItem(item, quantity, type, checked) {
  //add items to shopping list
  liveShoppingList.push({ item, quantity, type, checked });
  shoppingListDatabase.push({item, type});
}

//TURN LIST INTO HTML ELEMENTS
const render = () => {
  let row, item1, quantity1, type1;
  const tableBody = document.querySelector("\#table-body");

  tableBody.innerHTML = ""; //erase current list

  //loop through liveShoppingList and add elements
  for (let i = 0; i < liveShoppingList.length; i++) {
    row = document.createElement("tr");
    if (liveShoppingList[i].checked) row.classList.add("checked");

    item1 = document.createElement("td");
    item1.textContent = `${liveShoppingList[i].item}`;
    row.appendChild(item1);

    quantity1 = document.createElement("td");
    quantity1.textContent = `${liveShoppingList[i].quantity}`;
    row.appendChild(quantity1);

    type1 = document.createElement("td");
    type1.textContent = `${liveShoppingList[i].type}`;
    row.appendChild(type1);

    tableBody.appendChild(row);
  }
  enableToggleChecked();
};

//Categories.. in misc


function inputCategories(categories) {
  let option;
  categories.forEach((cat) => {
    option = document.createElement("option");
    option.textContent = cat;
    document.querySelector("\#cat-input").appendChild(option);
  });
}



// MAKE MISC ADD MODAL WORK - TO ADD ELEMENTS TO LIST
const miscModalBtn = document.querySelector("#misc-modal-btn");

let itemInput, catInput, qtyInput;
itemInput = document.querySelector("#item-input");
catInput = document.querySelector("#cat-input");
qtyInput = document.querySelector("#qty-input");

miscModalBtn.addEventListener("click", (event) => {
  
  newListItem(itemInput.value, qtyInput.value, catInput.value, false);

  render();
  

  itemInput.value = "";
  catInput.value = "";
  qtyInput.value = "";

  let successAlert = document.querySelector(".alert-success");
  successAlert.classList.remove("hidden");
  setTimeout(() => successAlert.classList.add("hidden"), 1000);

});


//Auto-fill type !!!!!!

//start by showing correct matches 
//then let person select by clicking 
//then let someone select with buttons and enter button (disable normal use)


let searchText, newAutocompleteItem; 
let autocompleteList = document.querySelector("\#autocomplete-list");
itemInput.addEventListener("keyup", event => {
  
  autocompleteList.innerHTML ="";
  autocompleteList.classList.add("hidden");
  
  searchText=event.target.value.trim().toLowerCase(); 
  //works with event.target, not event.currenttarget, look into... 
  if(!searchText==""){
  
    shoppingListDatabase.forEach(obj => {
      if (obj.item.trim().toLowerCase().slice(0,searchText.length)==searchText){
        newAutocompleteItem= document.createElement("li");
        newAutocompleteItem.classList.add("newAutocompleteItem");
        newAutocompleteItem.textContent=obj.item;
        autocompleteList.appendChild(newAutocompleteItem);
      }
    })
    if(!autocompleteList.innerHTML==""){
      autocompleteList.classList.remove("hidden");
    }
  }
  selectAutocomplete();
})

let autocompleteItems; 

function selectAutocomplete() {
  autocompleteItems=document.querySelectorAll(".newAutocompleteItem");
  autocompleteItems.forEach(li => {
    li.addEventListener("click", event => {
      itemInput.value = event.currentTarget.textContent;
      catInput.value = shoppingListDatabase.find(obj=>obj.item==event.currentTarget.textContent).type;
      autocompleteList.classList.add("hidden");

    })
  })
}





//TOGGLE CHECKED CLASS
// in render function because you always want to rerun when you render
let tableRow;
let objInShoppingList;
function enableToggleChecked() {
  //When someone clicks on table row tr, toggle class checked for that element
  //Make it a function so it works when html elements are changed, runs query selector again
  tableRow = document.querySelectorAll("tbody tr");
  console.log(tableRow);
  [...tableRow].forEach((el) =>
    el.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("checked");

      //change checked property in object to true or false

      objInShoppingList = liveShoppingList.find(
        (obj) => obj.item == event.currentTarget.querySelector("td").textContent
      );
      //toggle
      objInShoppingList.checked = objInShoppingList.checked ? false : true;
    })
  );
}

// DELETE ALL BUTTON

const deleteAllIcon = document.querySelector("#delete-all-icon");
deleteAllIcon.addEventListener("click", (event) => {
  liveShoppingList = [];
  render();
});

//DELETE CHECKED BUTTON
const deleteCheckedIcon = document.querySelector("#delete-checked-icon");
deleteCheckedIcon.addEventListener("click", (event) => {
  liveShoppingList = liveShoppingList.filter((obj) => !obj.checked);

  render();
});

//SORT LIST BUTTON
const sortIcon = document.querySelector("#sort-icon");
function sortList(sortedCat) {
  //These functions shouldnt change original array but they seem to do that?
  liveShoppingList.map(el => {
    el.type = sortedCat.indexOf(el.type);
    return el; 
  })

  liveShoppingList.sort((a,b)=>a.type-b.type);
  liveShoppingList.map(el => {
    el.type = sortedCat[el.type];
  })
  
  render();
}

sortIcon.addEventListener("click", () => sortList(sortedCat));


//Example
newListItem("Chicken", "1kg", "Meat", false);
newListItem("Cheese", "one block", "Dairy", false);


render();

//feel free to change sorted list to a different order
let sortedCat = ["Fruits", "Veg", "Dairy", "Meat", "Frozen"];
inputCategories(sortedCat);


