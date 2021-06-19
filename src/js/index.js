import Search from "./models/Search"
import Recipe from "./models/Recipe"
import List from "./models/List"
import Likes from "./models/Likes"
import * as searchview from './view/searchView';
import * as recipeView from "./view/recipeView"
import * as ListView from "./view/ListView";
import * as likesView from "./view/likesView";
import { element, speedLoader, clearLoader } from "./view/base"

/**
 * global stage of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipe
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */

const searchBar = async () => {
  //1.get query from view
  const query = searchview.getInput()

  if (query) {
    //2. New Search object and add to state
    state.search = new Search(query)

    //3) prepare UI for result
    searchview.clearInput()
    searchview.deleteInput()
    speedLoader(element.searchRes)

    try {
      //4) Search for recipe
      await state.search.getresults()

      //5)Rendar result on UI
      clearLoader()
      searchview.renderResults(state.search.result)
    } catch (err) {
      alert("Something wrongs with the search...")
      clearLoader()
    }
  }
}
element.searchField.addEventListener("submit", (e) => {
  e.preventDefault()
  searchBar()
})

element.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline")
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10)
    searchview.deleteInput()
    searchview.renderResults(state.search.result, goToPage)
    console.log(goToPage)
  }
})
/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "")


  if (id) {
    //prepare UI for changes
    recipeView.clearRecipe();
    speedLoader(element.recipe)

    //Highlight selected  search item 
    console.log(state.search);
    if(state.search) searchview.highlightSelected(id);

    //create new recipe projet
    state.recipe = new Recipe(id)

    try {
      //Get recipe data and parse ingrediants
      await state.recipe.getRecipe()
     
      state.recipe.parseIngrediants()

      //calculate  servings and time
      state.recipe.caleTime()
      state.recipe.servings()

      //Render recipe

      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch (error) {
      alert("Error processing recipe!")

    }
  }
}
;["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
)

/**
 * List CONTROLLER
 */
  const controlList = () => {
    //create a new list if there is none yet 
    if(!state.list) state.list = new List();

    //ADD each ingeediants to the list 
    state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingrediant);
      ListView.renderItem(item);
  });
  }

//handle delete item and update list item event 
element.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //handle delete event 
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      //delerte from state
      state.list.deleteItem(id);

      //delete from UI
      ListView.deleteItem(id);
      
      //handle the count update 
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * Like CONTROLLER
 */
//TESTING 


const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //user has not yet liked current recipe
  if(!state.likes.isLiked(currentID)) {

      //add like to the state
      const newLike = state.likes.addLikes(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
      );
      
      //toggle the like button 
        likesView.toggleLikeBtn(true)

      //ADD like to the UI list 
      likesView.renderLike(newLike);
    
      //use HAS like the recipe
  }else {
      
      //remove  like to the state
      state.likes.deleteLikes(currentID);
     
      //toggle the like button 
      likesView.toggleLikeBtn(false);
      

      // REMOVE like to the UI list
       likesView.deleteLike(currentID);
     
   
    
    
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());  
}

//restore like recipe on page load 
window.addEventListener('load', () => {
  state.likes = new Likes();
  
  //restore likes
  state.likes.readStorage();
  
  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes()); 

  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})


//handling button clicks 

element.recipe.addEventListener('click',e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
      //decrease button is clicked
      if(state.recipe.servings > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngrediants(state.recipe);
      }
      
    }else if(e.target.matches('.btn-increase, .btn-increase *')) {
      //increase button is clicked 
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngrediants(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')) {
      //Like countroller
      controlLike();
    }
 });
  
  //const l = new List();
  //window.l = l;

 