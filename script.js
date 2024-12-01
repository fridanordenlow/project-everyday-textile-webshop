import productList from './products.js';

const productListContainer = document.querySelector('#productList');
const cart = document.querySelector('#cartSummary');
const sortByNameElement = document.querySelector('#sortByName');
const sortByLowestPriceElement = document.querySelector('#sortByLowestPrice');
const sortByHighestPriceElement = document.querySelector('#sortByHighestPrice');
const sortByRatingElement = document.querySelector('#sortByRating');
const categoryDropdown = document.querySelector('#categoryDropdown');
const categoryDropdownBtn = document.querySelector('#categoryDropdownBtn');
const sortingDropdown = document.querySelector('#sortingDropdown');
const sortingDropdownBtn = document.querySelector('#sortingDropdownBtn');
const filterBathroom = document.querySelector('#filterBathroom');
const filterBedroom = document.querySelector('#filterBedroom');
const filterKitchen = document.querySelector('#filterKitchen');
const resetSortFiltBtn = document.querySelector('#resetSortFiltBtn');


// ------------------------------------------------------------------------------------
// --- PRODUCTS -----------------------------------------------------------------------
// ------------------------------------------------------------------------------------

let products = [...productList]

// A function that prints an html-element for each product
function printProductList() {
  productListContainer.innerHTML = ''; // Empty container of current products to update the products when they change
  products.forEach(product => {
    productListContainer.innerHTML += `
            <article class="single-product">
                <h3>${product.name}</h3>
                <p>${product.price} kr</p>
                <p>Rating: ${getRatingStars(product.rating)}</p>
                <div>
                    <button class="decrease" id="decrease-${product.id}">-</button>
                    <input type="number" min="0" value="${product.amount}" id="input-${product.id}">
                    <button class="increase" id="increase-${product.id}">+</button>
                </div>
            </article>
        `;
  });

  /**
   * - Have an add button that updates the amount chosen instead of immediate update of cart? 
   */
  const increaseButtons = document.querySelectorAll('button.increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', e => updateProductAmount(e, true));
  });
  const decreaseButtons = document.querySelectorAll('button.decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', e => updateProductAmount(e, false));
  });
}
printProductList();


// ------------------------------------------------------------------------------------
// --- SORTING AND FILTERS ------------------------------------------------------------
// ------------------------------------------------------------------------------------
/**
 * Sort/filter by:
 * x Name
 * x Price 
 * x Rating 
 * x Category 
 * x Have button for clearing filters/sorting
 */

categoryDropdownBtn.addEventListener('click', () => {
  categoryDropdown.classList.toggle('show');
})

// Closes the dropdown after you chose an option
function closeDropdown(dropdown) {
  dropdown.classList.remove('show');
}

/**
 * - Remake into loop?
 */
function sortByName() {
  products.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  printProductList();
}
sortByNameElement.addEventListener('click', () => {
  sortByName();
  closeDropdown(sortingDropdown); 
});

function sortByLowestPrice() {
  products.sort((a, b) => a.price - b.price);
  printProductList();
}
sortByLowestPriceElement.addEventListener('click', () => {
  sortByLowestPrice();
  closeDropdown(sortingDropdown);
});

function sortByHighestPrice() {
  products.sort((a, b) => b.price - a.price );
  printProductList();
}
sortByHighestPriceElement.addEventListener('click', () => {
  sortByHighestPrice();
  closeDropdown(sortingDropdown);
});

function sortByRating() {
  products.sort((a, b) => a.rating - b.rating);
  printProductList();
}
sortByRatingElement.addEventListener('click', () => {
  sortByRating();
  closeDropdown(sortingDropdown);
});


// Filter products by category
sortingDropdownBtn.addEventListener('click', () => {
  sortingDropdown.classList.toggle('show');
})

let chosenCategory = null;

function filterByCategory(category) {
  chosenCategory = category;

  const filteredProducts = chosenCategory ? productList.filter(prod => prod.category === chosenCategory) : productList;
  products = [...filteredProducts];
  printProductList(); 
}

// Byt eventuellt till en for-each-loop
filterBathroom.addEventListener('click', () => {
  filterByCategory('Bathroom');
  closeDropdown(categoryDropdown); 
});
filterBedroom.addEventListener('click', () => {
  filterByCategory('Bedroom');
  closeDropdown(categoryDropdown); 
});
filterKitchen.addEventListener('click', () => {
  filterByCategory('Kitchen');
  closeDropdown(categoryDropdown); 
});


// filterBathroom.addEventListener('click', () => filterByCategory('Bathroom'));
// filterBedroom.addEventListener('click', () => filterByCategory('Bedroom'));
// filterKitchen.addEventListener('click', () => filterByCategory('Kitchen'));

// const bathroomProducts = productList.filter(prod => prod.category === 'Bathroom');
// console.log(bathroomProducts)

function resetProductList() {
  products = [...productList];
  printProductList()
}
resetSortFiltBtn.addEventListener('click', resetProductList);


// ------------------------------------------------------------------------------------
// --- RATING SYMBOLS -----------------------------------------------------------------
// ------------------------------------------------------------------------------------

// cmd + D välj flera av samma namn och ändra

// Get rating for each product, moons instead of stars for now
function getRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStars = (rating % 1 === 0.5) ? 1 : 0; 
  const emptyStars = 5 - fullStars - halfStars; 

  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += `<span>🌕</span>`
  }
  if (halfStars) {
    html += `<span>🌗</span>`
  }
  for (let i = 0; i < emptyStars; i++) {
    html += `<span>🌑</span>`;
  }
  return html;
}

// ------------------------------------------------------------------------------------
// --- CART ---------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// A function that updates and increases product amount
function updateProductAmount(e, isIncrease) {
  const action = isIncrease ? 'increase' : 'decrease';
  const productId = Number(e.target.id.replace(`${action}-`, ''));
  console.log('clicked on button with id', productId);

  // Find product in array with correct id
  const foundProductIndex = products.findIndex(product => product.id === productId);
  // Message if product does not exist
  if (foundProductIndex === -1) {
    console.error('No such product exists. Check that product-ID is correct.');
    return;
  }

  // Update product amount
  const product = products[foundProductIndex];
  product.amount += isIncrease ? 1 : -1;

  // Ensure product amount does not go below zero
  product.amount = Math.max(product.amount, 0);

  printProductList();
  updateAndPrintCart();
}

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
  // Loop through and print chosen products
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

// ------------------------------------------------------------------------------------
// ---- FORM --------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

/**
 * Create an order form
 * x Connect to DOM-elements
 * x Validate form inputs
 * x Add more special cases with regex rules
 * - Card or invoice needs to be choosen for submit to work as well as personal data checkbox
 * x Reset button implemented
 */

const form = document.querySelector('#form');
const submitBtn = form.querySelector('#submitBtn');
const resetBtn = form.querySelector('#resetBtn');

const regexRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  streetAddress: /^(?=.*[a-zA-ZåäöÅÄÖ])[a-zA-ZåäöÅÄÖ0-9\s.,-]{2,}$/,
  city: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  phoneNumber: /^[0-9]{10}$/,
  zipCode: /^\d{3}\s?\d{2}$/,
};

const validationRules = {
  firstName: 'name',
  lastName: 'name',
  streetAddress: 'streetAddress',
  zipCode: 'zipCode',
  city: 'city',
  phone: 'phoneNumber',
  email: 'email',
};

function validateInput(inputElementId) {
  const inputField = document.getElementById(inputElementId);
  const inputFieldValue = inputField.value.trim();
  const feedbackField = inputField.parentElement.querySelector(".error-message");
  const rule = validationRules[inputElementId];

  if (!feedbackField) {
    console.log(`No feedback field found for ${inputField.id}`);
    return false;
  }

  if (inputFieldValue.length === 0) {
    feedbackField.textContent = '* This field is required.';
    return false;
  }

  if (rule && regexRules[rule]) {
    if (!regexRules[rule].test(inputFieldValue)) {
      feedbackField.textContent = `* Please enter a valid ${rule.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      return false;
    }
  }

  feedbackField.textContent = '✅';
  return true;
}

function validateAllInputs() {
  return Object.keys(validationRules).every(inputId => {
    const input = document.getElementById(inputId);
    return input.value.trim().length > 0 && validateInput(inputId);
  });
}

function updateSubmitButton() {
  submitBtn.disabled = !validateAllInputs();
}

const formInputs = form.querySelectorAll('input');
formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    if (input.value.trim().length > 0) {
      validateInput(input.id);
    }
    updateSubmitButton();
  });
});

function submitForm(e) {
  e.preventDefault();
  const orderSection = document.querySelector('#order-section');
  orderSection.innerHTML = `<p>Thank you! Your order has been received.</p>`;
}

function resetForm() {
  form.reset();
  document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
  const productsInCart = products.filter(product => product.amount > 0);

  cart.innerHTML = '';

  productsInCart.forEach(prod => {
    prod.amount = 0;
  })
}

submitBtn.addEventListener('click', submitForm);
resetBtn.addEventListener('click', resetForm)

updateSubmitButton();


// const form = document.querySelector('#form');
// const submitBtn = form.querySelector('#submitBtn');
// // const resetBtn = form.querySelector('#resetBtn');

// function validateInput(inputElementId, checkSpecialInput = '') {
//   const inputField = document.getElementById(inputElementId);
//   const inputFieldValue = inputField.value;
//   const feedbackField = inputField.parentElement.querySelector(".error-message");

//   if (!feedbackField) {
//     console.log(`No feedback field found for ${inputField}`);
//   }

//   let hasSpecialError = false;
//   let customErrorMessage = '';

//   const regexRules = {
//     email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     name: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
//     streetAddress: /^(?=.*[a-zA-ZåäöÅÄÖ])[a-zA-ZåäöÅÄÖ0-9\s.,-]{2,}$/,
//     city: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
//     phoneNumber: /^[0-9]{10}$/,
//     zipCode: /^\d{3}\s?\d{2}$/,
//   }

//   // Check special cases
//   if (checkSpecialInput) {
//     switch (checkSpecialInput) {
//       case 'email':
//         hasSpecialError = !regexRules.email.test(inputFieldValue);
//         customErrorMessage = 'Please enter a valid email address.';
//         break;
//       case 'name':
//         hasSpecialError = !regexRules.name.test(inputFieldValue);
//         customErrorMessage = 'Please enter a valid name.';
//         break;
//       case 'streetAddress':
//         hasSpecialError = !regexRules.streetAddress.test(inputFieldValue);
//         customErrorMessage = 'Please enter a valid street address.';
//         break;
//       case 'city':
//         hasSpecialError = !regexRules.city.test(inputFieldValue);
//         customErrorMessage = 'Please enter a valid city name.';
//         break;
//       case 'phoneNumber':
//         hasSpecialError = !regexRules.phoneNumber.test(inputFieldValue);
//         customErrorMessage = 'Phone number must be 10 digits.';
//         break;
//       case 'zipCode':
//         hasSpecialError = !regexRules.zipCode.test(inputFieldValue);
//         customErrorMessage = 'Zip code must be in the format "12345" or "123 45".';
//         break;
//       default:
//         console.log(`No regex rule defined for ${checkSpecialInput}`);
//     }
//     console.log('Validating:', inputField.id, inputFieldValue, 'with regex:', regexRules[checkSpecialInput]);
//   }

//   if (hasSpecialError || inputFieldValue.length === 0) {
//     feedbackField.innerHTML = `* ${customErrorMessage || 'This field is required.'}`;
//     // feedbackField.style.color = 'red';
//     return false;
//   } else {
//     feedbackField.innerHTML = '✅';
//     // feedbackField.style.color = 'green';
//     return true;
//   }
// }

// // Validate each field individually to show error message
// const formInputs = form.querySelectorAll('input');

// const validationRules = {
//   firstName: 'name',
//   lastName: 'name',
//   streetAddress: 'streetAddress',
//   zipCode: 'zipCode',
//   city: 'city',
//   phone: 'phoneNumber',
//   email: 'email',
// };

// formInputs.forEach(input => {
//   input.addEventListener('blur', () => {
//     validateInput(input.id, validationRules[input.id]);
//   });
// });

// //   formInputs.forEach(input => {
// //     input.addEventListener('blur', () => {
// //       const specialInputType = validationRules[input.id] || '';
// //       validateInput(input.id, specialInputType);
// //       console.log('Input validerad', input.id);
// //       updateSubmitButton();
// //     });
// // });
// // const formInputs = form.querySelectorAll('input');
// // formInputs.forEach(input => {
// //   input.addEventListener('blur', () => {
// //     validateInput(input.id);
// //     updateSubmitButton();
// //     console.log('Input validerad', input.id);
// //   })
// // })

// function validateAllInputs() {
//   let isValid = true;
//   isValid = validateInput('firstName') && isValid;
//   isValid = validateInput('lastName') && isValid;
//   isValid = validateInput('streetAddress') && isValid;
//   isValid = validateInput('zipCode', 'zipCode') && isValid;
//   isValid = validateInput('city') && isValid;
//   isValid = validateInput('phone', 'phoneNumber') && isValid;
//   isValid = validateInput('email') && isValid;
//   return isValid;
// }

// function updateSubmitButton() {
//   const isFormValid = validateAllInputs();
//   submitBtn.disabled = !isFormValid;
// }

// // On submit give feedback
// function submitForm(e) {
//   e.preventDefault();
//   const orderSection = document.querySelector('#order-section');
//   orderSection.innerHTML = `<p>Thank you! Your order has been received.</p>`
// }

// submitBtn.addEventListener('click', submitForm);


// ------------------------------------------------------------------------------------
// ---- TO DO -------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// --- DEAD CODE ----------------------------------------------------------------------
// ------------------------------------------------------------------------------------
/*
Första versionen av implementering av + och - funktionen på knapparna
const increaseButtons = document.querySelectorAll('button.increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', increaseProductAmount);
  });
  const decreaseButtons = document.querySelectorAll('button.decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseProductAmount);
  });

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