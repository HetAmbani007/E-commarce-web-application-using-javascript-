import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert("Something went wrong");
    }
  }
  caleTime() {
    const serve = this.ingredients.length;
    const periods = Math.ceil(serve / 3);
    this.time = periods * 15;
  }
  servings() {
    this.servings = 4;
  }
  parseIngrediants() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon ",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];

    const newIngrediants = this.ingredients.map((el) => {
      //1) Uniform units
      let ingrediant = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingrediant = ingrediant.replace(unit, unitsShort[i]);
      });
      //2)Remove perentheses
      ingrediant = ingrediant.replace(/ *\([^)]*\) */g, " ");

      //3)parse ingrediants into count, unit and ingrediants
      const arrIng = ingrediant.split(" ");
      const unitIndex = arrIng.findIndex((el2) => unitsShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //there is a unit

        //Ex  4 1/2 cups, arrcount is [4, 1/2]
        //Ex 4 cups,arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingrediant: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //there is no unit but 1 element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingrediant: arrIng.slice(1).join(" "),
        };
      } else {
        //there is no unit and no number in 1 st position
        objIng = {
          count: 1,
          unit: "",
          ingrediant,
        };
      }

      return objIng;
    });
    this.ingredients = newIngrediants;
  }

    updateServings (type) {
      // servings 
      const newServings = type === 'dec' ? this.servings-1 : this.servings+1;

      //ingrediants 
      this.ingredients.forEach(ing => {
        ing.count = ing.count * (newServings / this.servings);  
      });

      

      this.servings = newServings;
    }
}
