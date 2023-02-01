
/* Currently when you add grams and cups etc. it just concats the strings
Could make a cool version where it sums amounts properly
TODO: Fix that */ 
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

function newListItem(item,quantity,type) {
  liveShoppingList.push({item, quantity, type});
}

const liveShoppingList = [{item:Banana, quantity:2, type: Fruits}]; 



//TODO: Have a database of types. Only ask someone for a type if not already in database.
//Could even just have the first time you enter an item, it remembers the type 



//When someone presses the add to list button on the modal for misc
//take the values of the three choices 
//add adjacent html to the table 

const miscModalBtn = document.querySelector("\#misc-modal-btn");



//When someone clicks on table row tr, toggle class checked for that element 
const tableRow = document.querySelectorAll("tbody tr");
[...tableRow].forEach(el => el.addEventListener("click", event=>{
  event.currentTarget.classList.toggle("checked");
}) );



