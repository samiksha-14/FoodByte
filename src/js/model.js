import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from './helpers.js';
//we will have one seperate module for each view

//API CALLS HAPPEN IN MODEL.JS
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],

}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
        //and operator short circuits if recipe does not exist (false val)
        //then nothing will happen but if has some value then the second part
        //will be executed
    };
}
export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
    }
};
//to search the recipe
//controller will tell this function what should it search for therefore we are exporting 
//this function so that controller can control it (by passing the query )
export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),

            }
        });
        state.search.page = 1;
    } catch (err) {
        throw err;
    }

};
//implementing pagination
//this function will not be an async function bec we already have search
//results loades this time
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    //we want to display 10 results on a page
    //pg--1 (1-1)*10 =0

    const start = (page - 1) * state.search.resultsPerPage;//0;
    const end = page * state.search.resultsPerPage//9;
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newqt = oldqt*newserving/oldservings //2*8/4=4
    });
    state.recipe.servings = newServings;
};
const persisitBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const addBookmark = function (recipe) {
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    
    persisitBookmarks();

}
export const deleteBookmark = function (id) {
    //delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as not bookmarked
    if (id === state.recipe.id)
        state.recipe.bookmarked = false;

    persisitBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();
const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};
// clearBookmarks();
export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') &&
                entry[1] !== ''
            ).map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3)
                    throw new Error('wrong ingredient format! Please use the correct format');
                const [quantity, unit, description] = ingArr//this will return an array of 3 elements (qnt, unit, name of ing)
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        // console.log(recipe);
        const data = await
            AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        //storing dadta into state
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }

};















