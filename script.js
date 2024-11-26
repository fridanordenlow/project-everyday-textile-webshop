import products from './products.js';

//   {
//     id: 0,
//     name: 'Kitchen Towel',
//     price: 250,
//     rating: 5,
//     amount: 0,
//     category: 'kitchen',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
//   {
//     id: 1,
//     name: 'Bath Towel',
//     price: 375,
//     rating: 4,
//     amount: 0,
//     category: 'bathroom',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
//   {
//     id: 2,
//     name: 'Hand Towel',
//     price: 265,
//     rating: 3,
//     amount: 0,
//     category: 'bathroom',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
//   {
//     id: 3,
//     name: 'Hand Towel 2',
//     price: 275,
//     rating: 3,
//     amount: 0,
//     category: 'bathroom',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
//   {
//     id: 4,
//     name: 'Small Towel',
//     price: 175,
//     rating: 3,
//     amount: 0,
//     category: 'bathroom',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
//   {
//     id: 5,
//     name: 'Kitchen Towel 2',
//     price: 260,
//     rating: 4,
//     amount: 0,
//     category: 'kitchen',
//     /*img: {
//             url:,
//             alt:
//             width:,
//             height:
//         }*/
//   },
// ];

// ----------------------------
// --- HTML ELEMENTS ----------
// ----------------------------
const productListContainer = document.querySelector('#product-list');
const cart = document.querySelector('#cart-summary');

// A function that prints a html-element for each product
function printProductList() {
  productListContainer.innerHTML = ''; // Empty container of current products to update the products when they change
  products.forEach(product => {
    productListContainer.innerHTML += `
            <article class="single-product">
              <img>
                <h3>${product.name}</h3>
                <p>${product.price} kr</p>
                <p>Rating: ${product.rating} out of 5</p>
                <div>
                    <button class="decrease" id="decrease-${product.id}">-</button>
                    <input type="number" min="0" value="${product.amount}" id="input-${product.id}">
                    <button class="increase" id="increase-${product.id}">+</button>
                </div>
            </article>
        `;
  });
  // Create functions to make the - and + buttons adjust the chosen amount of each product
  // Have an add button that updates the amount chosen?
  // Increase button function
  const increaseButtons = document.querySelectorAll('button.increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', e => updateProductAmount(e, true));
  });
  const decreaseButtons = document.querySelectorAll('button.decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', e => updateProductAmount(e, false));
  });
  /*
  const increaseButtons = document.querySelectorAll('button.increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', increaseProductAmount);
  });
  const decreaseButtons = document.querySelectorAll('button.decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseProductAmount);
  });
  */
}
printProductList();

/**
 * Create a shopping cart that displays all chosen products:
 * - How many of each product
 * - How much the total sum of each product
 * - Total sum of all products
 * */

// A function that updates and increases product amount
function updateProductAmount(e, isIncrease) {
  const action = isIncrease ? 'increase' : 'decrease';
  const productId = Number(e.target.id.replace(`${action}-`, ''));
  console.log('clicked on button with id', productId);

  // Find product in array with correct id
  const foundProductIndex = products.findIndex(product => product.id === productId);
  // Message if product does not exist
  if (foundProductIndex === -1) {
    console.error('Det finns ingen sådan produkt i listan. kolla att id:t är rätt');
    return;
  }

  // Update product amount
  const product = products[foundProductIndex];
  product.amount += isIncrease ? 1 : -1;

  // Ensure amount does not go below zero
  product.amount = Math.max(product.amount, 0);

  printProductList();
  updateAndPrintCart();
}

/*
function increaseProductAmount(e) {
  const productId = Number(e.target.id.replace('increase-', ''));
  console.log('clicked on button with id', productId);
  // Find product in array with correct id
  const foundProductIndex = products.findIndex(product => product.id === productId);
  // Message if product does not exist
  if (foundProductIndex === -1) {
    console.error('Det finns ingen sådan produkt i listan. kolla att id:t är rätt');
    return;
  }

  // Increase amount with +1
  products[foundProductIndex].amount += 1;

  printProductList();
  updateAndPrintCart();
}

// A function that updates and decreases product amount
function decreaseProductAmount(e) {
  const productId = Number(e.target.id.replace('decrease-', ''));
  console.log('clicked on button with id', productId);
  // Find product in array with correct id
  const foundProductIndex = products.findIndex(product => product.id === productId);
  // Message if product does not exist
  if (foundProductIndex === -1) {
    console.error('Det finns ingen sådan produkt i listan. kolla att id:t är rätt');
    return;
  }

  // Increase amount with +1
  products[foundProductIndex].amount -= 1;

  printProductList();
  updateAndPrintCart();
}
*/
// ------------------------
// ------------------------

// A function that prints chosen products
function updateAndPrintCart() {
  // Create a variable that stores chosen products
  const chosenProducts = products.filter(product => product.amount > 0);
  // Calculate the total sum of chosen products
  const totalCartSum = chosenProducts.reduce((sum, product) => {
    return sum + (product.amount * product.price);
  }, 0);
  console.log(chosenProducts, totalCartSum);

  // Print products in cart
  cart.innerHTML = ''; // Empty element from current content
  // Loop through chosen products
  chosenProducts.forEach(product => {
    cart.innerHTML += `
    <div> 
      ${product.name}: ${product.amount} st - ${product.amount * product.price} kr
    </div>
    `;
  });
  cart.innerHTML += `
  <div>
  Total sum: ${totalCartSum} kr
  </div>
  `
}

updateAndPrintCart();

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
