'use strict';

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = {
  items: [
    { name: 'apples', checked: false, edited: false },
    { name: 'oranges', checked: false, edited: false },
    { name: 'milk', checked: true, edited:false },
    { name: 'bread', checked: false, edited: false }
  ],
  checkedShown: true//used for the toggling between showing and unshowing the checked items
};


const generateItemElement = function(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <input type="text" name="item-entry" class="item-edit-field" placeholder="Edit title here">
    </button>
    <button class='edit-item-submission'>
          <span class='button-label'>submit changes</span>
        </button>
        
      </div>
    </li>`;
};


const generateShoppingItemsString = function(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
};


const renderShoppingList = function() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const addItemToShoppingList = function(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
};

const handleNewItemSubmit = function() {
  $('#js-shopping-list-form').submit(event => {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
};

const toggleCheckedForListItem = function(itemIndex) {
  console.log(`Toggling checked property for item at index ${itemIndex}`);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
};

const getItemIndexFromElement = function(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
};

const handleItemCheckClicked = function() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
};

const deleteListItem = function(itemIndex) {
  STORE.items.splice(itemIndex,1);
};

const handleDeleteItemClicked = function() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
};

const handleEditItemSubmission = function(){
  //edits the item after the user types something into the field and hits edit item??
  //let currentItem = STORE.items.itemIndex;
  $('.js-shopping-list').on('click','.edit-item-submission', event => {
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    let updatedItemName = $('.item-edit-field').val();
    
    console.log(updatedItemName);
    //updateEditedItemName(updatedItemName);
    if (updatedItemName !== ''){//if not a blank string
      STORE.items[itemIndex].name = updatedItemName;
      
    }
    else{
      //do nothing
    }
    console.log(STORE.items[itemIndex].name);
    renderShoppingList();
  });
  
};

const handleFilterCheckedClicked = function(){
//this function will be responsible for handling the filter checked button when it is clicked
  $('.checkedSwitchContainer').on('click','.checkedSwitch-button', event => {
    
    console.log('`handleFilterCheckedClicked` ran');
    let checkedStatus = toggleChecked();
    if(checkedStatus){
      //remove hidden class
      $('.js-item-index-element').removeClass('hidden');
      renderShoppingList();
    }
    else if(!checkedStatus){
      //add hidden class
      $('.js-item-index-element').addClass('hidden');
      renderShoppingList();
    }
  });
};
    
const toggleChecked = function(){
  //this function will toggle on and off the checked items once the filterChecked button is clicked
  STORE.items.checkedShown = !STORE.items.checkedShown;
  return STORE.items.checkedShown;
};

const handleFilterSearchResults = function(){
  
  $('.js-shopping-list-entry').on('keyup', function() {
    let value = $(this).val().toLowerCase();
    $('.shopping-list li').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
};

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterSearchResults();
  handleEditItemSubmission();
  handleFilterCheckedClicked();

}

$(handleShoppingList);