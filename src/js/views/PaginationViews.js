import icons from 'url:../../img/icons.svg';
import View from "./view.js";
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //adding the event listner to the common parent element
    this._parentElement.addEventListener('click', function (e) {
      ///closest methode searches up in the tree //it look for parents
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);

    })
  }
  //creating generate markup method bec this is the method which
  //render method is going to call to generate the markup for view
  //every view generate something on UI
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length) / this._data.resultsPerPage;
    console.log(numPages);

    // page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
             <button data-goto ="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `;
    }

    //last page
    if (currPage === numPages && numPages > 1) {
      return `
            <button data-goto = "${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
            `;
    }
    //other page
    if (currPage < numPages) {
      //    here we will need both the buttons , button to go forward+backward
      return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goto = "${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>

            `
    }
    // page 1, and there are no other pages
    return '';
  }
}

export default new PaginationView();