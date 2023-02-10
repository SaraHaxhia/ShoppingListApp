

let liveShoppingList = [];
let shoppingListDatabase = [];
let recipeDatabase = [{"Name":"Salmon burgers", "Ingredients":{"Salmon":{"quantity":"2 packs", "commonPantry":false}}}];


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

let option;
function inputCategories(categories) {
  
  categories.forEach((cat) => {
    option = document.createElement("option");
    option.textContent = cat;
    document.querySelector("\#cat-input").appendChild(option);
    option = document.createElement("option");
    option.textContent = cat;
    //NOT WORKING 
    document.querySelectorAll(".recipe-cat-input").forEach(x => x.appendChild(option));
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

//Make Misc modal always open empty 
let miscIcon = document.querySelector("\#misc-icon");
miscIcon.addEventListener("click", () => {
  itemInput.value = "";
  catInput.value = "";
  qtyInput.value = "";
})

//AUTO-FILL CATEGORIES ON MISC 

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

//RECIPES TAB TOGGLE

let recipeTab = document.querySelector("\#recipe-tab");
let newRecipeTab = document.querySelector("\#new-recipe-tab");

let tabTitle = document.querySelectorAll(".tabtitle");
tabTitle.forEach(tabTitleEl => {
  tabTitleEl.addEventListener("click", event => {
    tabTitle.forEach(el => el.classList.remove("tabtitleactive"));
    event.currentTarget.classList.add("tabtitleactive");
    if(event.currentTarget.getAttribute("id")=="recipelibrarytitle"){
      recipeTab.classList.remove("invisible");
      newRecipeTab.classList.add("invisible");
    } else if (event.currentTarget.getAttribute("id")=="newrecipetitle"){
      newRecipeTab.classList.remove("invisible");
      recipeTab.classList.add("invisible");
      //erase changes you made before you exited modal/toggled away
      ingredientsInputList = document.querySelector("\#ingredients-input-list");
      ingredientsInputList.innerHTML = `<div class="row ingredients-input-row">
      <div class="recipe-new-ingredient col">
        <input class="recipe-ingredient-input form-control"  type="text" placeholder="Item">
      </div>
      <div class="recipe-new-qnty col">
        <input class="recipe-qnty-input form-control"  type="text" placeholder="Quantity">
      </div>
      <div class="recipe-new-cat col">
        <select required class="recipe-cat-input form-control" >
          <option value="" selected disabled hidden>Type..</option>
          
        </select>
      </div>
      <div class="recipe-common-pantry col">
        <select class="form-control">
          <option>-</option>
          <option> Common pantry item</option>
        </select>  
      </div>
      
      </div>`;
    }
    
  })
})

//When you press recipes button, it always opens on recipes page
let recipesModalIcon=document.querySelector("\#recipes-modal-icon");
let recipelibraryTitle=document.querySelector("\#recipelibrarytitle");
recipesModalIcon.addEventListener("click", event => {
  recipeTab.classList.remove("invisible");
  newRecipeTab.classList.add("invisible");
  tabTitle.forEach(el => el.classList.remove("tabtitleactive"));
  recipelibraryTitle.classList.add("tabtitleactive");

})

//Recipe list 



//RENDER RECIPE LIST
let recipe1, recipeList; 
function renderRecipeList() {
  recipeList = document.querySelector("\#recipe-list");
  recipeList.innerHTML = "";
  recipeDatabase.forEach(recipe => {
    recipe1 = document.createElement("li");
    recipe1.textContent = recipe.Name; 
    recipeList.appendChild(recipe1); 
    
  })
}

//PLUS BUTTON MAKES NEW INGREDIENTS INPUT ROW 
//If I want to, I could give each input an id... using ${}
//Need a delete row icon 
let plusIcon=document.querySelector("\#ingredients-plus-icon");
let ingredientsInputList=document.querySelector("\#ingredients-input-list");
plusIcon.addEventListener("click", event=>{
  ingredientsInputList.insertAdjacentHTML("beforeend", `<br> <div class="row ingredients-input-row">
  <div class="recipe-new-ingredient col">
    <input class="recipe-ingredient-input form-control"  type="text" placeholder="Item">
  </div>
  <div class="recipe-new-qnty col">
    <input class="recipe-qnty-input form-control"  type="text" placeholder="Quantity">
  </div>
  <div class="recipe-new-cat col">
    <select required class="recipe-cat-input form-control" >
      <option value="" selected disabled hidden>Type..</option>
      
    </select>
  </div>
  <div class="recipe-common-pantry col">
    <select class="form-control">
      <option>-</option>
      <option> Common pantry item</option>
    </select>  
  </div>
  
  </div>`)
})



//RUN CODE.... 


// FIX THIS FUNCTION!!! MAKE IT EASY TO ADD INGREDIENTS, QNTY and COMMON PANTRY 
//MAKE SURE YOU CODE A COMMON PANTRY AUTOFILL... 

renderRecipeList();

//Example
newListItem("Chicken", "1kg", "Meat", false);
newListItem("Cheese", "one block", "Dairy", false);



render();

//feel free to change sorted list to a different order
let sortedCat = ["Fruits", "Veg", "Dairy", "Meat", "Frozen"];
inputCategories(sortedCat);


