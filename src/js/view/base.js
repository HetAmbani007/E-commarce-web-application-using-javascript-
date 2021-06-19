export const element = {
  searchField: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping:document.querySelector('.shopping__list'),
  likesMenu:document.querySelector('.likes__list')
};

export const elmentString = {
  loader: "loader",
};

export const speedLoader = (parent) => {
  const loader = `
        <div class= "${elmentString.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elmentString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
