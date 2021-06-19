import { element } from './base';

export const getInput = () => element.searchInput.value;

export const clearInput = () => {
    element.searchInput.value = '';
};

export const deleteInput = () => {
    element.searchResList.innerHTML = '';
    element.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    document.querySelector(`.results__link[href= "#${id}"]`).classList.add('result__link--active');
    
    };




const limitRecipeTitle = (title,limit =17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc +cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;

        }, 0);
        //return  the result
        return `${newTitle.join('')}...`;
    }
    return title;
}





const renderRecipe = recipe =>{
    const markup = `
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    element.searchResList.insertAdjacentHTML('beforeend',markup);
}
//type 'prev' or 'next'
const createBUtton = (page ,type) => `
<button class="btn-inline results__btn--${type}" data-goto = ${type == 'prev'? page -1: page + 1}>
<span>Page ${type == 'prev'? page -1: page + 1}</span>                   
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type == 'prev'? 'left': 'right'}"></use>
                    </svg>
</button>                    

`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    
    let button;
    if(page === 1 && pages>1){
        //only button to go next page
        button = createBUtton(page , 'next');
    }else if (page < pages){
        //both button
        button = `
            ${createBUtton(page , 'prev')}
            ${createBUtton(page , 'next')}        
    `;
    }else if(page === pages && pages > 1){
        //only button to go prev page
        button = createBUtton(page , 'prev');
    }
    element.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipe, page = 1 ,resPerPage = 10) => {
    const start = (page -1)* resPerPage;
    const end = page *resPerPage;

    
    recipe.slice(start , end).forEach(renderRecipe);  

    //render pagination buttons
    renderButtons(page, recipe.length,resPerPage);
};


