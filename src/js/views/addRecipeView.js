import  icons from 'url:../../img/icons.svg';
import View from "./view.js";

class addRecipeView extends View {
    _parentElement =document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }
    toggleWindow(){
          this._overlay.classList.toggle('hidden');
            this._window.classList.toggle('hidden');
    }
    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click',this.toggleWindow.bind(this))
    }
     _addHandlerHideWindow(){
        this._btnClose.addEventListener('click',this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }
     _addHandlerUpload(handler){
        this._parentElement.addEventListener('submit',function(e){
            e.preventDefault();
            //to read the data from form we can use form data
            //how to use --> in form data constructor pass in the form
            //converting the data we get from the upload(parent element) into
            //an array and our recipe data is an object not an array so we will
            //convert it into an object
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);

        })
    }
    _generateMarkup(){}
}

export default new addRecipeView();