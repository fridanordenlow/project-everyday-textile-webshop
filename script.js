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
 * x Card or invoice needs to be choosen for submit to work as well as personal data checkbox
 * x Reset button implemented
 * - MOVE INTO MODULES if there is time !!!!!!!
 */

const form = document.querySelector('#form');
const submitBtn = form.querySelector('#submitBtn');
const resetBtn = form.querySelector('#resetBtn');
const paymentOptionRadios = Array.from(document.querySelectorAll('input[name="payment-option"]'));
const cardOption = document.querySelector('input[name="payment-option"][value="card"]');
const invoiceOption = document.querySelector('input[name="payment-option"][value="invoice"]');
let selectedPaymentOption = paymentOptionRadios.find(radio => radio.checked)?.value || 'card';
const personalDataCheckbox = document.querySelector('input[type="checkbox"][required]');

// REGEX
const regexRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  streetAddress: /^(?=.*[a-zA-ZåäöÅÄÖ])[a-zA-ZåäöÅÄÖ0-9\s.,-]{2,}$/,
  city: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  phoneNumber: /^[0-9]{10}$/,
  zipCode: /^\d{3}\s?\d{2}$/,
  personalID: /^(19|20)?\d{2}((0[1-9])|(1[0-2]))(([0-2][0-9])|(3[0-1]))[- ]?\d{4}$/,
};

// Validation rules
const validationRules = {
  firstName: 'name',
  lastName: 'name',
  streetAddress: 'streetAddress',
  zipCode: 'zipCode',
  city: 'city',
  phone: 'phoneNumber',
  email: 'email',
  personalID: 'personalID'
};

function validateInput(inputElementId) {
  const inputField = document.getElementById(inputElementId);
  const inputFieldValue = inputField.value.trim();
  const feedbackField = inputField.parentElement.querySelector(".error-message");
  const rule = validationRules[inputElementId];

  if (!inputField) {
    console.warn(`Input field with id "${inputElementId}" not found`);
    return false;
  }

  if (!feedbackField) {
    console.warn(`Feedback field with id "${inputElementId}" not found`);
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

// Switch between card or invoice payment, toggle visibility
function switchPaymentOption() {
  selectedPaymentOption = document.querySelector('input[name="payment-option"]:checked').value;
  const cardSection = document.querySelector('.card');
  const invoiceSection = document.querySelector('.invoice');
  
  cardSection.classList.toggle('hidden', selectedPaymentOption !== 'card');
  invoiceSection.classList.toggle('hidden', selectedPaymentOption !== 'invoice');
  
  console.log(`${selectedPaymentOption} selected`);
  updateSubmitButton();
}

function validateAllInputs() {
  const allInputsValid = Object.keys(validationRules).every(inputId => {
    const input = document.getElementById(inputId);
    return input.value.trim().length > 0 && validateInput(inputId);
  });

  const paymentSelected = cardOption.checked || invoiceOption.checked;
  const personalDataAccepted = personalDataCheckbox.checked;

  return allInputsValid && paymentSelected && personalDataAccepted;
}


function updateSubmitButton() {
  submitBtn.disabled = !validateAllInputs();
}


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

// Add event listeners
const inputs = [
  document.querySelector('#firstName'),
  document.querySelector('#lastName'),
  document.querySelector('#streetAddress'),
  document.querySelector('#zipCode'),
  document.querySelector('#city'),
  document.querySelector('#phone'),
  document.querySelector('#email'),
  document.querySelector('#personalID'),
]

inputs.forEach(input => {
  // change to focus out?
  input.addEventListener('blur', () => {
    validateInput(input.id);
    updateSubmitButton(); 
  });
});

// const formInputs = form.querySelectorAll('input');
// formInputs.forEach(input => {
//   input.addEventListener('blur', () => {
//     if (input.value.trim().length > 0) {
//       validateInput(input.id);
//     }
//     updateSubmitButton();
//   });
// });

paymentOptionRadios.forEach(radioBtn => {
  radioBtn.addEventListener('change', switchPaymentOption);
})

if (cardOption && invoiceOption) {
  [cardOption, invoiceOption].forEach(radio => {
    radio.addEventListener('change', () => {
      updateSubmitButton();
    });
  });
} else {
  console.error('Card or invoice option not found');
}

personalDataCheckbox.addEventListener('change', updateSubmitButton);
submitBtn.addEventListener('click', submitForm);
resetBtn.addEventListener('click', resetForm)

// switchPaymentOption();
updateSubmitButton();

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