import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksview from './views/bookmarksview.js';
import PaginationViews from './views/PaginationViews.js';
import addRecipeView from './views/addRecipeView.js';

// import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

//async function runs in background
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0 ) update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    //1 updating bookmarks view
    bookmarksview.update(model.state.bookmarks);
    // 2)loading recipe
    await model.loadRecipe(id);
    //3 )rendering the recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //get search query
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    //load search results
    await model.loadSearchResults(query);
    //render results
    resultView.render(model.getSearchResultsPage());

    //render pagination buttons
    PaginationViews.render(model.state.search)

  } catch (err) {
    console.log(err);
  }
};
//this controller will get executed when click on one of the page next button happens
const controlPagination = function (goToPage) {
  //render the result and pagination button
  //render new results
  resultView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  PaginationViews.render(model.state.search)
};
const controlServings = function (newServings) {
  //this will beexecuted when user want to inc or dec the servings
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //2 )rendering the recipe
  //we do not want to render the whole page of recipe while inc or dec the servings
  //so we will make a new method which will only update the servings markup
  recipeView.update(model.state.recipe);
}
const controlAddBookmark = function () {
  //add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //update recipe view
  recipeView.update(model.state.recipe);
  //render bookmark
  bookmarksview.render(model.state.bookmarks);
}
const controlBookmarks = function () {
  bookmarksview.render(model.state.bookmarks)
}
//to upload user's recipe to API
const controlAddRecipe = async function (newRecipe) {
  try {

    //show loading spinner
    addRecipeView.renderSpinner();
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render the recipe
    recipeView.render(model.state.recipe);
    //succes message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksview.render(model.state.bookmarks);

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    addRecipeView.renderError(err.message)
      ;
  }
  console.log(newRecipe)
}
const init = function () {
  bookmarksview.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationViews.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();


