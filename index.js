

let liveShoppingList = [];
let shoppingListDatabase = [];
let recipeDatabase = [{"Name":"Salmon burgers", "Ingredients":[{ "Item": "Salmon", "Quantity":"2 packs", "Type" : "Fish", "CommonPantry":false}]}];

let plusIcon=document.querySelector("\#ingredients-plus-icon");
let ingredientsInputList=document.querySelector("\#ingredients-input-list");
let newRow;

let option;

let tableRow;
let objInShoppingList;

let recipeTab = document.querySelector("\#recipe-tab");
let newRecipeTab = document.querySelector("\#new-recipe-tab");

let tabTitle = document.querySelectorAll(".tabtitle");

let row, item1, quantity1, type1;

const miscModalBtn = document.querySelector("#misc-modal-btn");
let itemInput, catInput, qtyInput;
itemInput = document.querySelector("#item-input");
catInput = document.querySelector("#cat-input");
qtyInput = document.querySelector("#qty-input");

let miscIcon = document.querySelector("\#misc-icon");

let searchText, newAutocompleteItem; 
let autocompleteList = document.querySelector("\#autocomplete-list");
let autocompleteItems; 

const deleteAllIcon = document.querySelector("#delete-all-icon");

const deleteCheckedIcon = document.querySelector("#delete-checked-icon");

const sortIcon = document.querySelector("#sort-icon");

let recipesModalIcon=document.querySelector("\#recipes-modal-icon");
let recipelibraryTitle=document.querySelector("\#recipelibrarytitle");

let recipeNameForList, recipeList; 

const newRecipeBtn=document.querySelector("\#new-recipe-btn");
let recipeListName, listOfIngredients; 
let ingredientsInputRow = document.querySelector(".ingredients-input-row");
let itemRecipeInput, qntyRecipeInput, catRecipeInput, commonpanRecipeInput;  

let successAlert;

function newListItem(item, quantity, type, commonpantry, checked) {
  //add items to shopping list
  liveShoppingList.push({ item, quantity, type,commonpantry, checked });
  shoppingListDatabase.push({item, type});
}


//TURN LIST INTO HTML ELEMENTS
const render = () => {
  
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

//Categories.. in misc and recipe


function inputCategories(categories, selector) {
  
  categories.forEach((cat) => {
    option = document.createElement("option");
    option.textContent = cat;
    document.querySelector(selector).appendChild(option);

    
  })
}






// MAKE MISC ADD MODAL WORK - TO ADD ELEMENTS TO LIST


let miscInputForm = document.querySelector("\#misc-input");

miscInputForm.addEventListener("submit", (event) => {
  
  event.preventDefault(); 
  newListItem(itemInput.value, qtyInput.value, catInput.value, false, false);

  render();
  

  itemInput.value = "";
  catInput.value = "";
  qtyInput.value = "";

  successAlert = document.querySelector("\#success-add-misc");
  successAlert.classList.remove("hidden");
  setTimeout(() => successAlert.classList.add("hidden"), 1000);
  console.log(liveShoppingList);

});

//Make Misc modal always open empty 

miscIcon.addEventListener("click", () => {
  itemInput.value = "";
  catInput.value = "";
  qtyInput.value = "";
})



//AUTO-FILL CATEGORIES ON MISC 

//start by showing correct matches 
//then let person select by clicking 
//then let someone select with buttons and enter button (disable normal use)




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

function enableToggleChecked() {
  //When someone clicks on table row tr, toggle class checked for that element
  //Make it a function so it works when html elements are changed, runs query selector again
  tableRow = document.querySelectorAll("tbody tr");
  
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


deleteAllIcon.addEventListener("click", (event) => {
  liveShoppingList = [];
  render();
});

//DELETE CHECKED BUTTON

deleteCheckedIcon.addEventListener("click", (event) => {
  liveShoppingList = liveShoppingList.filter((obj) => !obj.checked);

  render();
});

//SORT LIST BUTTON

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
      eraseNewRecipeList();
    }
    
  })
})

//Erase changes to add new recipe list

function eraseNewRecipeList() {
  //remove all child but one - the first row 
  //and then set the values to ""
  ingredientsInputRow = document.querySelector(".ingredients-input-row");
  ingredientsInputList = document.querySelector("\#ingredients-input-list");
      
    while(ingredientsInputList.childNodes.length >2){
      ingredientsInputList.removeChild(ingredientsInputList.lastChild);

    }
    
    ingredientsInputRow.children[0].children[0].value = ""; 
    ingredientsInputRow.children[1].children[0].value = ""; 
    ingredientsInputRow.children[2].children[0].value = ""; 
    ingredientsInputRow.children[3].children[0].value = ""; 
  


      recipeName = document.querySelector("\#recipeName");
      recipeName.value ="";
}

//When you press recipes button, it always opens on recipes page

recipesModalIcon.addEventListener("click", event => {
  recipeTab.classList.remove("invisible");
  newRecipeTab.classList.add("invisible");
  tabTitle.forEach(el => el.classList.remove("tabtitleactive"));
  recipelibraryTitle.classList.add("tabtitleactive");

})

//Recipe list 



//RENDER RECIPE LIST
let newNestedList, ingredientInRecipeList; 
let qntyStringAdjustment;
function renderRecipeList() {
  //erase the current list
  recipeList = document.querySelector("\#recipe-list");
  recipeList.innerHTML = "";
  //For each recipe in the database
  recipeDatabase.forEach(recipe => {
    //add the name of the recipe to the list
    recipeListName = document.createElement("li");
    recipeListName.textContent = recipe.Name; 

    //make a nested list under the name 
    newNestedList = document.createElement("ul");
    
    //for each ingredient, add a list element with the item and qnty 
    recipe.Ingredients.forEach(ingredientObj => {
      
      ingredientInRecipeList = document.createElement("li");
      //only have comma when you have a qnty 
      qntyStringAdjustment = ingredientObj.Quantity.trim() =="" ? "" : `, ${ingredientObj.Quantity}`;
      ingredientInRecipeList.textContent = `${ingredientObj.Item}${(qntyStringAdjustment)}`;
      newNestedList.appendChild(ingredientInRecipeList);
    });
    //add to html
    newNestedList.classList.add("invisible");
    recipeListName.appendChild(newNestedList);
    recipeList.appendChild(recipeListName); 
    
    
  })
  canExpandRecipe();
}

//See ingredients in recipes in recipe library  when you click on recipes
let recipeListItems

function canExpandRecipe() {
recipeListItems = document.querySelectorAll("\#recipe-list > li"); 
console.log("hi")
recipeListItems.forEach(recipeListItem => {
console.log("ok");
  recipeListItem.addEventListener("click", event=> {       
   event.currentTarget.children[0].classList.toggle("invisible");
  })
})
}

//PLUS BUTTON MAKES NEW INGREDIENTS INPUT ROW 
//If I want to, I could give each input an id... using ${}
//Need a delete row icon 


plusIcon.addEventListener("click", event=>{

  ingredientsInputRow = document.querySelector(".ingredients-input-row");
  newRow = ingredientsInputRow.cloneNode(true);
  newRow.children[0].children[0].value = ""; 
  newRow.children[0].children[0].required = false; 
  newRow.children[1].children[0].value = ""; 
  newRow.children[2].children[0].value = ""; 
  newRow.children[3].children[0].value = ""; 
  ingredientsInputList.appendChild(newRow);
  
})

//MAKE NEW RECIPE SAVE CHANGES BUTTON WORK - add to recipe database

newRecipeForm = document.querySelector("\#new-recipe-form");

newRecipeForm.addEventListener("submit", event => {
  ingredientsInputRow = document.querySelectorAll(".ingredients-input-row");
  recipeName = document.querySelector("\#recipeName").value; 
  listOfIngredients = []; 
  
  ingredientsInputRow.forEach(row => {
    itemRecipeInput = row.children[0].children[0].value;
    qntyRecipeInput = row.children[1].children[0].value;
    catRecipeInput = row.children[2].children[0].value;
    commonpanRecipeInput = (row.children[3].children[0].value=="Common pantry item");
    if(!(itemRecipeInput.trim() == "")){
    listOfIngredients.push({"Item": itemRecipeInput, "Quantity": qntyRecipeInput, "Type":catRecipeInput, "CommonPantry": commonpanRecipeInput}); 
    }
  })

  recipeDatabase.push({"Name": recipeName, "Ingredients":listOfIngredients});
  renderRecipeList();
  eraseNewRecipeList();
  let successAlertRecipe = document.querySelector("\#success-add-recipe");
  successAlertRecipe.classList.remove("invisible");
  setTimeout(() => successAlertRecipe.classList.add("invisible"), 1000);
  event.preventDefault();

})

//RUN CODE.... 


// FIX THIS FUNCTION!!! MAKE IT EASY TO ADD INGREDIENTS, QNTY and COMMON PANTRY 
//MAKE SURE YOU CODE A COMMON PANTRY AUTOFILL... 

renderRecipeList();

//Example
newListItem("Chicken", "1kg", "Meat", false, false);
newListItem("Cheese", "one block", "Dairy", false, false);




render();

//feel free to change sorted list to a different order
let sortedCat = ["Fruits", "Veg", "Dairy", "Meat", "Frozen", ""];
inputCategories(sortedCat, "\#cat-input");
//inputCategories(sortedCat,);
sortedCat.forEach((cat) => {
  option = document.createElement("option");
  option.textContent = cat;
  document.querySelector("\#recipe-cat-input").appendChild(option);
})


