import View from "./view.js";
import previewView from "./previewView.js";
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = `No recipe found for your query! please try again :)`;
    _message = '';
    _generateMarkup() {
        //we want to generate each search results and resnder it
        return this._data.
            map(result => previewView.render(result, false))
            .join('')
    }
}

export default new ResultView();