import productList from './data/products.mjs';
import getRatingStars from './helpers/getRatingStars.mjs';
import getPriceMultiplier from './helpers/getPriceMultiplier.mjs';
import startInactivityTimer from './helpers/startInactivityTimer.mjs';
import regexRules from './rules/regexRules.mjs';
import validationRules from './rules/validationRules.mjs';

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

// const today = new Date(); // Should be inside the if-statement

// ------------------------------------------------------------------------------------
// --- PRODUCTS -----------------------------------------------------------------------
// ------------------------------------------------------------------------------------

let products = [...productList];

// A function that prints an html-element for each product
function printProductList() {
  productListContainer.innerHTML = ''; // Empty container of current products to update the products when they change

  let priceIncrease = getPriceMultiplier();

  products.forEach(product => {
    productListContainer.innerHTML += `
            <article class="single-product">
            <img src="${product.img.url}" alt="${product.img.alt}" width="${product.img.width}" height="${product.img.height}" loading="lazy">
            <h3>${product.name}</h3>
            <p>${(Math.round(product.price * priceIncrease * 2) / 2).toFixed(2).replace(/\.00$/, '')} kr</p>
            <p>Rating: ${getRatingStars(product.rating)}</p>
                <div>
                    <button class="decrease" id="decrease-${product.id}">-</button>
                    <input type="number" min="0" value="${product.amount}" id="input-${product.id}">
                    <button class="increase" id="increase-${product.id}">+</button>
                </div>
            </article>
        `;
  });

  // ---- TO DO -------------------------------------------------------------------------
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
});

// Closes the dropdown after you chose an option
function closeDropdown(dropdown) {
  dropdown.classList.remove('show');
}

// ---- TO DO -------------------------------------------------------------------------
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
  products.sort((a, b) => b.price - a.price);
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
});

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

function resetProductList() {
  products = [...productList];
  printProductList();
}

resetSortFiltBtn.addEventListener('click', resetProductList);

// ------------------------------------------------------------------------------------
// --- CART ---------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

const cartProductCount = document.getElementById('cartProductCount');

function updateCartIcon() {
  const totalProducts = products.reduce((sum, product) => sum + product.amount, 0);

  if (totalProducts > 0) {
    cartProductCount.textContent = totalProducts;
    cartProductCount.style.display = 'block';
  } else {
    cartProductCount.style.display = 'none';
  }
}

// A function that updates and increases product amount
function updateProductAmount(e, isIncrease) {
  const action = isIncrease ? 'increase' : 'decrease';
  const productId = Number(e.target.id.replace(`${action}-`, ''));
  console.log('clicked on button with id', productId);

  const foundProductIndex = products.findIndex(product => product.id === productId);
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
  updateCartIcon();
  updateAndPrintCart();
}

function updateAndPrintCart() {
  const chosenProducts = products.filter(product => product.amount > 0);

  if (chosenProducts.length === 0) {
    cart.innerHTML = 'Your cart is empty.';
    return;
  }

  cart.innerHTML = '';

  let totalCartSum = 0;
  let orderProductAmount = 0;
  let msg = '';
  let priceIncrease = getPriceMultiplier();

  // Loop through and print chosen products
  chosenProducts.forEach(product => {
    orderProductAmount += product.amount;
    let productPrice = product.price;

    // Lowered price if you order 10 or more of a product - does not work?
    if (product.amount >= 10) {
      productPrice *= 0.9;
      console.log('Product price lowered to:', productPrice.toFixed(2));
    }
    const adjustedProductPrice = productPrice * priceIncrease;
    totalCartSum += product.amount * adjustedProductPrice;

    cart.innerHTML += `
    <div> 
      ${product.name}: ${product.amount} st - ${product.amount * product.price} kr
    </div>
    `;
  });

  if (totalCartSum <= 0) {
    return; // Stop the rest of the function
  }

  const today = new Date();
  if (today.getDay() === 1 && today.getHours() < 10) {
    totalCartSum *= 0.9;
    msg += '<p>Monday discount: 10% off on your order.</p>';
  }

  if (orderProductAmount >= 15) {
    cart.innerHTML += '<p>Shipping: 0 kr</p>';
  } else {
    cart.innerHTML += `<p>Shipping: ${Math.round(25 + 0.1 * totalCartSum)} kr</p>`;
  }

  let formattedTotalCartSum = totalCartSum.toFixed(2);
  if (formattedTotalCartSum.endsWith('.00')) {
    formattedTotalCartSum = formattedTotalCartSum.slice(0, -3);
  }

  cart.innerHTML += `<div>Total sum: ${formattedTotalCartSum} kr</div>`;
  cart.innerHTML += `<div>${msg}</div>`;

  updatePaymentOptions(totalCartSum);
}

updateAndPrintCart();

// ------------------------------------------------------------------------------------
// ---- TOGGLE BETWEEN CART AND FORM VIEW ---------------------------------------------
// ------------------------------------------------------------------------------------
const cartView = document.getElementById('cartView');
const orderView = document.getElementById('orderView');
const proceedToOrderBtn = document.getElementById('proceedToOrderBtn');
const backToCartBtn = document.getElementById('backToCartBtn');

// Function to switch to order form view
function showOrderForm() {
  cartView.classList.add('hidden');
  orderView.classList.remove('hidden');
}

// Function to switch back to cart view
function showCart() {
  cartView.classList.remove('hidden');
  orderView.classList.add('hidden');
}

// Add event listeners to the buttons
proceedToOrderBtn.addEventListener('click', showOrderForm);
backToCartBtn.addEventListener('click', showCart);

// ------------------------------------------------------------------------------------
// ---- FORM --------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// Are some of these variables unnecessary complex? Re-write?
const form = document.querySelector('#form');
const cardOption = document.querySelector('input[name="payment-option"][value="card"]');
const invoiceOption = document.querySelector('input[name="payment-option"][value="invoice"]');
const paymentOptionRadios = Array.from(document.querySelectorAll('input[name="payment-option"]'));
let selectedPaymentOption = paymentOptionRadios.find(radio => radio.checked)?.value || 'card';
const personalDataCheckbox = document.querySelector('input[type="checkbox"][required]');
const submitBtn = form.querySelector('#submitBtn');
const resetBtn = form.querySelector('#resetBtn');

function validateInput(inputElementId) {
  const inputField = document.getElementById(inputElementId);
  const inputFieldValue = inputField.value.trim();
  const feedbackField = inputField.parentElement.querySelector('.error-message');
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
    feedbackField.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> This field is required.';
    return false;
  }

  if (rule && regexRules[rule]) {
    if (!regexRules[rule].test(inputFieldValue)) {
      feedbackField.innerHTML = `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Please enter a valid ${rule.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      return false;
    }
    feedbackField.innerHTML = ''; // Clear error message
    return true;
  }

  // Maybe no feedback needed when the input is correct
  // feedbackField.innerHTML = '<i class="fa-solid fa-check"></i>';
  // return true;
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

// A function that disables invoice as a payment option if the total order sum is above 800 kr
function updatePaymentOptions(totalCartSum) {
  const invoiceMessage = document.getElementById('invoiceMessage');
  if (!invoiceMessage) {
    console.warn('Invoice message element not found');
    return; // Exit the function if the element doesn't exist
  }

  if (totalCartSum > 800) {
    invoiceOption.disabled = true; 
    invoiceMessage.classList.remove('hidden'); 
  } else {
    invoiceOption.disabled = false;
    invoiceMessage.classList.add('hidden');
  }

  const orderView = document.getElementById('orderView');
  if (!orderView.classList.contains('hidden')) {
    updateSubmitButton();
  }
}
// function updatePaymentOptions(totalCartSum) {
//   const invoiceMessage = document.getElementById('invoiceMessage');
//   if (totalCartSum > 800) {
//     invoiceOption.disabled = true; 
//     invoiceMessage.classList.remove('hidden'); 
//   } else {
//     invoiceOption.disabled = false;
//   }
//   updateSubmitButton();
// }

function validateAllInputs() {
  const orderView = document.getElementById('orderView');
  if (orderView.classList.contains('hidden')) {
    return false; // Don't validate if the order form isn't visible
  }
  const allInputsValid = Object.keys(validationRules).every(inputId => {
    const input = document.getElementById(inputId);
    if (!input) {
      console.warn(`Input with id "${inputId}" not found`);
      return false;
    }
    return input.value.trim().length > 0 && validateInput(inputId);
  });
  const paymentSelected = cardOption.checked || invoiceOption.checked;
  // console.log(`Payment selected: ${paymentSelected}`);

  const personalDataAccepted = personalDataCheckbox.checked;
  // console.log(`Personal data accepted: ${personalDataAccepted}`);

  console.log(`All inputs valid: ${allInputsValid && paymentSelected && personalDataAccepted}`);

  return allInputsValid && paymentSelected && personalDataAccepted;
}

function updateSubmitButton() {
  const orderView = document.getElementById('orderView');
  if (!orderView.classList.contains('hidden')) {
    submitBtn.disabled = !validateAllInputs();
  }
}
// function updateSubmitButton() {
//   const isValid = validateAllInputs();
//   submitBtn.disabled = !isValid;
//   console.log(`Submit button disabled: ${!isValid}`);
// }
// function updateSubmitButton() {
//   submitBtn.disabled = !validateAllInputs();
// }

/**
 * - Re-name to submit order or something like that
 */
function submitOrder(e) {
  e.preventDefault();
  const orderView = document.querySelector('#orderView');
  orderView.innerHTML = `
  <p>Thank you! We have received your order. Expected delivery time is 2-3 business days.</p>
  `;
}

function resetForm(manual = false) {
  form.reset();
  document.querySelectorAll('.error-message').forEach(msg => (msg.textContent = ''));
  const timerMessage = document.querySelector('#timerMessage');
  if (!manual) {
    timerMessage.innerHTML = 'You are too slow! The form has been reset.';
    console.log('Form has been reset due to inactivity.')
  }
  
  const productsInCart = products.filter(product => product.amount > 0);
  productsInCart.forEach(prod => {
    prod.amount = 0;
  });
  
  printProductList();
  updateCartIcon();
  updateAndPrintCart();
}

// Event listeners for inactivity to start timer to reset form
form.addEventListener('input', () => startInactivityTimer(() => resetForm()));
form.addEventListener('mousemove', () => startInactivityTimer(() => resetForm()));
form.addEventListener('keypress', () => startInactivityTimer(() => resetForm()));

// Inputs to validate
const inputsToValidate = [
  document.querySelector('#firstName'),
  document.querySelector('#lastName'),
  document.querySelector('#streetAddress'),
  document.querySelector('#zipCode'),
  document.querySelector('#city'),
  document.querySelector('#phone'),
  document.querySelector('#email'),
  document.querySelector('#personalID'),
];

// Add event listeners
inputsToValidate.forEach(input => {
  // change to focus out?
  input.addEventListener('blur', () => {
    validateInput(input.id);
    updateSubmitButton();
  });
});

paymentOptionRadios.forEach(radioBtn => {
  radioBtn.addEventListener('change', () => {
    switchPaymentOption();
    updateSubmitButton();
  });
});

personalDataCheckbox.addEventListener('change', updateSubmitButton);

if (cardOption && invoiceOption) {
  [cardOption, invoiceOption].forEach(radio => {
    radio.addEventListener('change', () => {
      updateSubmitButton();
    });
  });
} else {
  console.error('Card or invoice option not found');
}

submitBtn.addEventListener('click', submitOrder);
resetBtn.addEventListener('click', () => {
  resetForm(true);
  console.log('Reset button has been pressed');
});

updateCartIcon();
updateSubmitButton();

// ------------------------------------------------------------------------------------
// ---- TO DO -------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
