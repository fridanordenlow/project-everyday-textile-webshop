// Create an array for all products as objects
const products = [
  {
    id: 0,
    name: 'Kitchen Towel',
    price: 250,
    rating: 5,
    amount: 0,
    category: 'kitchen',
    /*img: {
            url:,
            alt:
            width:,
            height:
        }*/
  },
  {
    id: 1,
    name: 'Bath Towel',
    price: 375,
    rating: 4,
    amount: 0,
    category: 'bathroom',
    /*img: {
            url:,
            alt:
            width:,
            height:
        }*/
  },
  {
    id: 2,
    name: 'Hand Towel',
    price: 265,
    rating: 3,
    amount: 0,
    category: 'bathroom',
    /*img: {
            url:,
            alt:
            width:,
            height:
        }*/
  },
];

// ----------------------------
// --- HTML ELEMENTS ----------
// ----------------------------
const productListContainer = document.querySelector('#product-list');

// Create a function that prints html-element for each of all products
function printProductList() {
  products.forEach(product => {
    productListContainer.innerHTML += `
            <article>
              <img>
                <h3>${product.name}</h3>
                <p>${product.price} kr</p>
                <p>Rating: ${product.rating} out of 5</p>
                <div>
                    <button class="decrease" id="decrease-${product.id}">-</button>
                    <input type="number" min="0" value="${product.amount}" id="input-${product.id}">
                    <button class="increase" id="increase-${product.id}">+</button>
                    <p>Test</p>
                </div>
            </article>
        `;
  });
}

printProductList();

/**
 * Create a shopping cart that displays all chosen products:
 * - How many of each product
 * - How much the total sum of each product
 * - Total sum of all products
 * */

/**
 * Create functions (connected to buttons) that sorts products based on:
 * - Name
 * - Price
 * - Category
 * - Rating
 */

/**
 * Create an order form
 * - Connect to DOM-elements
 */
