

let liveShoppingList = [];
let shoppingListDatabase = [];
let recipeDatabase = [{"Name":"Salmon burgers", "Ingredients":[{ "Item": "Salmon", "Quantity":"2 packs", "Type" : "Fish", "CommonPantry":false},{ "Item": "Avocado", "Quantity":"3", "Type" : "Fruits", "CommonPantry":false}, { "Item": "Onion", "Quantity":"1 bag", "Type" : "Veg", "CommonPantry":true} ]}];

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

let itemInput = document.querySelector("#item-input");
let catInput = document.querySelector("#cat-input");
let qtyInput = document.querySelector("#qty-input");


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

//add items to shopping list
function newListItem(item, quantity, type, commonpantry, checked) {
  
  liveShoppingList.push({ item, quantity, type,commonpantry, checked });
  addToShoppingListDatabase(item, type, commonpantry);
  
}

function addToShoppingListDatabase(item, type, commonpantry){
  let itemFoundInShoppingListDatabase = shoppingListDatabase.find(el => el.item == item.trim().toLowerCase());
  if( itemFoundInShoppingListDatabase== undefined) {
    shoppingListDatabase.push({item:item.trim().toLowerCase(), type, commonpantry});
  } else {
    //update elements in case category or commonpantry has changed
   shoppingListDatabase = shoppingListDatabase.map( el => el == itemFoundInShoppingListDatabase ? {item:item.trim().toLowerCase(), type, commonpantry} : el); 
  } 
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
    if (!cat == "") {
      option = document.createElement("option");
      option.textContent = cat;
      document.querySelector(selector).appendChild(option);
    }
    
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
  

});

//Make Misc modal always open empty 

miscIcon.addEventListener("click", () => {
  itemInput.value = "";
  catInput.value = "";
  qtyInput.value = "";
  autocompleteList.classList.add("hidden");
})



//AUTO-FILL CATEGORIES ON MISC 



let objItemClean;
itemInput.addEventListener("keyup", event => {
  
  
  autocompleteList.innerHTML ="";
  autocompleteList.classList.add("hidden");
  
  searchText=event.target.value.trim().toLowerCase(); 
  
  if(!searchText==""){
    
    shoppingListDatabase.forEach(obj => {
      objItemClean = obj.item.trim().toLowerCase();
      if (objItemClean.slice(0,searchText.length)==searchText ){ 
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


//autocomplete list 2 - in recipes modal - 
function autocomplete2() {
let itemInput2 = document.querySelectorAll(".recipe-ingredient-input");


itemInput2.forEach ( itemInput_ => {
itemInput_.addEventListener("keyup", event => {
  let autocompleteList2 = event.currentTarget.parentNode.querySelector(".autocomplete-list2");
  
  autocompleteList2.innerHTML ="";
  autocompleteList2.classList.add("hidden");
  
  searchText=event.target.value.trim().toLowerCase(); 
  
  if(!searchText==""){
    
  
    shoppingListDatabase.forEach(obj => {
      let objItemClean = obj.item.trim().toLowerCase();
      if (objItemClean.slice(0,searchText.length)==searchText ){ 
        newAutocompleteItem= document.createElement("li");
        newAutocompleteItem.classList.add("newAutocompleteItem2");
        newAutocompleteItem.textContent=obj.item;
        
        autocompleteList2.appendChild(newAutocompleteItem);
      }
      
    })
    if(!autocompleteList2.innerHTML==""){
      autocompleteList2.classList.remove("hidden");
    }
  }
  selectAutocomplete2();
})})
const recipeNewIngredient = document.querySelectorAll(".recipe-new-ingredient");
recipeNewIngredient.forEach(itemInput_ => {
  itemInput_.addEventListener("focusout", event => {
    let autocompleteList2 = event.currentTarget.parentNode.querySelector(".autocomplete-list2");
    autocompleteList2.classList.add("hidden");
  });
  });
}

autocomplete2(); 

//make clicking on item, autocomplete the category/type
function selectAutocomplete() {
  autocompleteItems=document.querySelectorAll(".newAutocompleteItem");
  autocompleteItems.forEach(li => {
    li.addEventListener("mousedown", event => {
      
      itemInput.value = event.currentTarget.textContent;
      catInput.value = shoppingListDatabase.find(obj=>obj.item==event.currentTarget.textContent).type;
      

    })
  })
  
}

//for second list 

function selectAutocomplete2() {
  let autocompleteItems2=document.querySelectorAll(".newAutocompleteItem2");
  
  autocompleteItems2.forEach(li => {
    li.addEventListener("mousedown", event => {
      
      
      
      event.currentTarget.parentNode.parentNode.querySelector("input").value = event.currentTarget.textContent;
      event.currentTarget.parentNode.parentNode.parentNode.querySelector(".recipe-cat-input").value = shoppingListDatabase.find(obj=>obj.item==event.currentTarget.textContent).type;
      if(shoppingListDatabase.find(obj=>obj.item==event.currentTarget.textContent).commonpantry) {
        event.currentTarget.parentNode.parentNode.parentNode.querySelector(".recipe-common-pantry-select").value ="Common pantry item"; 
      }

      
      
      
      
    })
  })
}


//make search box disappear on focus out 

itemInput = document.querySelector("\#item-input");
autocompleteList = document.querySelector("\#autocomplete-list");
const newItem = document.querySelector("\#new-item");

 
newItem.addEventListener("focusout", event=> {
  
  
  autocompleteList.classList.add("hidden");
  
});

//for second list look in function autocomplete2








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
  
  liveShoppingList.map(el => {
    el.type = sortedCat.indexOf(el.type);
    
    el.checked = el.checked ? 1 : 0; //put checked items at the bottom
    
  })

  liveShoppingList.sort((a,b)=>a.type-b.type);
  liveShoppingList.sort((a,b) => a.checked - b.checked);
  liveShoppingList.map(el => {
    el.type = sortedCat[el.type];
    el.checked = el.checked ==1 ? true : false; 
    
  })
  
  render();
}

sortIcon.addEventListener("click", () => sortList(sortedCat));

//RECIPES TAB TOGGLE


const newRecipeClose = document.querySelector("\#new-recipe-close");
tabTitle.forEach(tabTitleEl => {
  tabTitleEl.addEventListener("click", event => {
    tabTitle.forEach(el => el.classList.remove("tabtitleactive"));
    event.currentTarget.classList.add("tabtitleactive");
    
    if(event.currentTarget.getAttribute("id")=="recipelibrarytitle"){
      recipeTab.classList.remove("invisible");
      newRecipeTab.classList.add("invisible");
      newRecipeDelete.classList.add("invisible");
      newRecipeBtn.classList.add("invisible");
      newRecipeClose.classList.add("invisible");
    } else if (event.currentTarget.getAttribute("id")=="newrecipetitle"){
      newRecipeTab.classList.remove("invisible");
      recipeTab.classList.add("invisible");
      newRecipeBtn.classList.remove("invisible");
      newRecipeClose.classList.remove("invisible");
      newRecipeDelete.classList.remove("invisible");
      
      //erase changes you made before you exited modal/toggled away
      eraseNewRecipeList();
    }
    
  })
})

//Erase changes to add new recipe list

function eraseNewRecipeList() {
  
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

      recipeAutocompleteList.classList.add("hidden");
}

//When you press recipes button, it always opens on recipes page
let newRecipeDelete = document.querySelector("\#new-recipe-delete");
recipesModalIcon.addEventListener("click", event => {
  recipeTab.classList.remove("invisible");
  newRecipeTab.classList.add("invisible");
  newRecipeBtn.classList.add("invisible");
  newRecipeClose.classList.add("invisible");
  newRecipeDelete.classList.add("invisible");
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
    //make invisible by default
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

recipeListItems.forEach(recipeListItem => {

  recipeListItem.addEventListener("click", event=> {       
   event.currentTarget.children[0].classList.toggle("invisible");
  })
})
}

//PLUS BUTTON MAKES NEW INGREDIENTS INPUT ROW 


function createNewRow() {
  ingredientsInputRow = document.querySelector(".ingredients-input-row");
  newRow = ingredientsInputRow.cloneNode(true);
  newRow.children[0].children[0].value = ""; 
  newRow.children[0].children[0].required = false; 
  newRow.children[1].children[0].value = ""; 
  newRow.children[2].children[0].value = ""; 
  newRow.children[3].children[0].value = ""; 
  ingredientsInputList.appendChild(newRow);
  autocomplete2(); 
}

plusIcon.addEventListener("click", event=>{

  createNewRow();
  
})

//RECIPE NAME AUTOCOMPLETE SO YOU CAN EDIT RECIPES

let recipeNameBox = document.querySelector("\#recipeName");
let recipeAutocompleteList = document.querySelector("\#recipe-autocomplete-list");
let newRecipeAutocompleteItem; 
recipeNameBox.addEventListener("keyup", event => {
  
  recipeAutocompleteList.innerHTML="";
  recipeAutocompleteList.classList.add("hidden"); 
  
  //Do our search
  searchText=event.target.value.trim().toLowerCase(); 
  if(!searchText==""){
    recipeDatabase.forEach(obj => {
      objItemClean = obj.Name.trim().toLowerCase();
      if (objItemClean.slice(0,searchText.length)==searchText ){
        newRecipeAutocompleteItem = document.createElement("li"); 
        newRecipeAutocompleteItem.classList.add("newRecipeAutocompleteItem");
        newRecipeAutocompleteItem.textContent=obj.Name;
        recipeAutocompleteList.appendChild(newRecipeAutocompleteItem);
      }
      
    })
    if(!recipeAutocompleteList.innerHTML==""){
      recipeAutocompleteList.classList.remove("hidden");
      
    }
  }
  selectRecipeAutocomplete(); 

})

function selectRecipeAutocomplete() {
  let recipeAutocompleteItems = document.querySelectorAll(".newRecipeAutocompleteItem");
  recipeAutocompleteItems.forEach(li => {
    li.addEventListener("mousedown", event => {
      eraseNewRecipeList();
      ingredientsInputList = document.querySelector("\#ingredients-input-list");
      let thisRecipe = recipeDatabase.find(obj=>obj.Name===event.currentTarget.textContent);
      let thisRecipeIngredientsList = thisRecipe.Ingredients;
      
      let recipeName = document.querySelector("\#recipeName");
      recipeName.value = thisRecipe.Name;

      

      //Handling initial row
      ingredientsInputList.querySelector(".recipe-ingredient-input").value = thisRecipeIngredientsList[0].Item;
      ingredientsInputList.querySelector(".recipe-qnty-input").value = thisRecipeIngredientsList[0].Quantity;
      ingredientsInputList.querySelector(".recipe-cat-input").value = thisRecipeIngredientsList[0].Type;
      ingredientsInputList.querySelector(".recipe-common-pantry-select").value = thisRecipeIngredientsList[0].CommonPantry ? "Common pantry item" : "-";

      for(let i =1; i<thisRecipeIngredientsList.length; i++){
        //press plus and then add this stuff to the last child.. 
        createNewRow();
        
        ingredientsInputList.lastChild.querySelector(".recipe-ingredient-input").value = thisRecipeIngredientsList[i].Item;
        ingredientsInputList.lastChild.querySelector(".recipe-qnty-input").value = thisRecipeIngredientsList[i].Quantity;
        ingredientsInputList.lastChild.querySelector(".recipe-cat-input").value = thisRecipeIngredientsList[i].Type;
        ingredientsInputList.lastChild.querySelector(".recipe-common-pantry-select").value = thisRecipeIngredientsList[i].CommonPantry ? "Common pantry item" : "-";
        

       
      }
      
      
    })
  })
}


//MAKE NEW RECIPE SAVE CHANGES BUTTON WORK - add to recipe database

let deleteRecipeBtn = document.querySelector("\#new-recipe-delete");
deleteRecipeBtn.addEventListener("click", event => {
  event.preventDefault();
  recipeName = document.querySelector("\#recipeName").value; 
  if(recipeDatabase.find(el => el.Name.trim().toLowerCase() ==recipeName.trim().toLowerCase())!==undefined){
    const deleteData = confirm(`Warning: you are about to delete ${recipeName} from your list of recipes. This cannot be undone.`);
    if (deleteData) {
      let prevItem = recipeDatabase.find(el => el.Name.trim().toLowerCase() ==recipeName.trim().toLowerCase()); 
      recipeDatabase.splice(recipeDatabase.indexOf(prevItem), 1);
      renderRecipeList();
      eraseNewRecipeList();
      renderCheckboxRecipes();
    } else {
      return;
    }
  } else {
    alert("You need to type the name of a recipe you have to delete it.");
  }

} 

)

newRecipeForm = document.querySelector("\#new-recipe-form");

newRecipeForm.addEventListener("submit", event => {

  
  event.preventDefault();
  

  ingredientsInputRow = document.querySelectorAll(".ingredients-input-row");
  recipeName = document.querySelector("\#recipeName").value; 
  listOfIngredients = []; 


  
  if(recipeDatabase.find(el => el.Name.trim().toLowerCase() ==recipeName.trim().toLowerCase())!==undefined){
    
    const overwriteData = confirm("Warning: You are about to overwrite this recipe. This cannot be undone.");
    
    if (overwriteData) {
      let prevItem = recipeDatabase.find(el => el.Name.trim().toLowerCase() ==recipeName.trim().toLowerCase()); 
      recipeDatabase.splice(recipeDatabase.indexOf(prevItem), 1);
    } else {
      return;
    }
    
  } 


  
  
  ingredientsInputRow.forEach(row => {
    itemRecipeInput = row.children[0].children[0].value;
    qntyRecipeInput = row.children[1].children[0].value;
    catRecipeInput = row.children[2].children[0].value;
    commonpanRecipeInput = (row.children[3].children[0].value=="Common pantry item");
    console.log(commonpanRecipeInput);
    if(!(itemRecipeInput.trim() == "")){
    listOfIngredients.push({"Item": itemRecipeInput, "Quantity": qntyRecipeInput, "Type":catRecipeInput, "CommonPantry": commonpanRecipeInput}); 
    addToShoppingListDatabase(itemRecipeInput, catRecipeInput, commonpanRecipeInput);
    }
  })

  recipeDatabase.push({"Name": recipeName, "Ingredients":listOfIngredients});
  renderRecipeList();
  eraseNewRecipeList();
  let successAlertRecipe = document.querySelector("\#success-add-recipe");
  successAlertRecipe.classList.remove("hidden");
  setTimeout(() => successAlertRecipe.classList.add("hidden"), 1000);

  renderCheckboxRecipes();
}

)

newRecipeForm.addEventListener("submit", event => {

});

let checkboxList, clrecipeInput, clrecipeListName, counter=1, cpCounter=1, clLi, breakEl; 
//Render recipe in add recipe to list 
function renderCheckboxRecipes() {
  
  checkboxList = document.querySelector("\#checkbox-list");
  checkboxList.innerHTML ="";
   
  //for each recipe, create an li element with input and label
  recipeDatabase.forEach(recipe => {
    let recipeCommonPantry = recipe.Ingredients.filter(el => el.CommonPantry==true);
    
    
    clLi = document.createElement("li"); 
    clrecipeInput = document.createElement("input"); 
    clrecipeInput.setAttribute("type","checkbox");
    clrecipeInput.setAttribute("name", `recipe${counter}`);
    clLi.classList.add("checkbox");
    clLi.classList.add("checkbox-recipes-names");
    
    clrecipeListName = document.createElement("label");
    clrecipeListName.setAttribute("for",`recipe${counter}`);
    clrecipeListName.textContent=recipe.Name;
    clrecipeListName.classList.add("checkbox-name"); 

    clrecipeInput.setAttribute("value", `${recipe.Name}`);

    clLi.appendChild(clrecipeInput);
    clLi.appendChild(clrecipeListName);
    
    
    

    //if there is common pantry elements
    //create an indented list 
    //add each to indented list
    if (recipeCommonPantry.length !== 0) {
      let indentedCheckbox=document.createElement("ul");
    
    
    recipeCommonPantry.forEach(item => {
      let cpListItem = document.createElement("li");
      cpListItem.classList.add("checkbox");
      let commonPantryInput = document.createElement("input"); 
      commonPantryInput.setAttribute("type","checkbox");
      commonPantryInput.setAttribute("name", `${item.Item}`);
      cpListItem.classList.add("checkbox-commonpantry-names");
      cpListItem.classList.add("invisible");
    
      let commonPantryName = document.createElement("label");
      commonPantryName.setAttribute("for",`${item.Item}`);
      let itemQntyAdjustment = item.Quantity.trim()=="" ? "" : `, ${item.Quantity}`; 
      commonPantryName.textContent=`${item.Item}${itemQntyAdjustment}`;
      
      commonPantryName.classList.add("checkbox-name"); 
      
      

      cpListItem.appendChild(commonPantryInput);
      cpListItem.appendChild(commonPantryName);
      indentedCheckbox.appendChild(cpListItem);
      cpCounter++;
      

    })
    clLi.appendChild(indentedCheckbox);
    
  }

  
  checkboxList.appendChild(clLi);
  counter++; 
    

  })

  commonpantryChecklist();
}
  






//SELECTING RECIPES ADD TO SHOPPING LIST 

let checkboxRecipesForm = document.querySelector("\#checkbox-recipes");

let checkboxes, checkboxesArr; 
let recipeDatabaseItem; 

checkboxRecipesForm.addEventListener("submit", event => {

  event.preventDefault(); 
  checkboxes=document.querySelectorAll(".checkbox-recipes-names");
  checkboxesArr=Array.from(checkboxes);
  
  
  
  checkboxesArrFiltered = checkboxesArr.filter(checkbox=> checkbox.firstChild.checked);
  
  
  
  checkboxesArrFiltered.forEach(box => {
    
    boxFirst = box.firstChild;
    //find the object in the database
    recipeDatabaseItem = recipeDatabase.find(obj => obj.Name==boxFirst.value);
    
    //for common pantry elements, basically look at checked children and add those 
    let commonpantrySelected = box.querySelectorAll(".checkbox-commonpantry-names");
    commonpantrySelected=Array.from(commonpantrySelected);
    commonpantrySelected = commonpantrySelected.filter(checkbox=> checkbox.firstChild.checked);
    
    commonpantrySelected = commonpantrySelected;
    


    
    recipeDatabaseItem.Ingredients.forEach(ingred => {

      
      if(ingred.CommonPantry) {
        
        const found = commonpantrySelected.find(el => el.firstChild.name == ingred.Item); 
        if(found!==undefined){
          newListItem(ingred.Item, ingred.Quantity, ingred.Type, ingred.CommonPantry, false);
        
        
        }
        
        
      } else { 
        
        
      //add all ingredients in database that aren't in common pantry
      newListItem(ingred.Item, ingred.Quantity, ingred.Type, ingred.CommonPantry, false);
      }
    
  })

    

    
    
  })
  render();
  
  checkboxesArrFiltered.forEach(box => {
    box.firstChild.checked = false; 
    let subbox = box.querySelectorAll(".checkbox-commonpantry-names");
    subbox?.forEach(b => b.classList.toggle("invisible"));
    subbox?.forEach(b=>{
      if(b?.firstChild?.checked!==undefined) b.firstChild.checked=false;
    })
    
    
    
  });
  let successAlertRecipeCheckbox = document.querySelector("\#success-add-checkbox-recipe");
  successAlertRecipeCheckbox.classList.remove("hidden");
  setTimeout(() => successAlertRecipeCheckbox.classList.add("hidden"), 1400);
})



//toggle common pantry checkboxes

function commonpantryChecklist(){
  checkboxes=document.querySelectorAll(".checkbox");
  checkboxes.forEach(box => {
    box.querySelector("input").addEventListener("click", event => {
      event.currentTarget.parentElement.querySelectorAll(".checkbox-commonpantry-names")?.forEach(b => b.classList.toggle("invisible")); 
    })
  })
}
//RUN CODE.... 




renderRecipeList();
renderCheckboxRecipes();

//Example
newListItem("Chicken", "1kg", "Meat", false, false);
newListItem("Cheese", "one block", "Dairy", false, false);
newListItem("Chocolate", "one bar", "Dessert", true, false);




render();

//feel free to change sorted list to a different order
let sortedCat = ["Fruits", "Veg", "Dairy", "Meat", "Frozen","Fish", "Dessert",""];
inputCategories(sortedCat, "\#cat-input");
//inputCategories(sortedCat,);

inputCategories(sortedCat, "\#recipe-cat-input");


