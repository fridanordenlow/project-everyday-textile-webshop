// Skapa en array med objekt för alla produkter
const products = [
    {
        id: 0,
        name: 'Wool Skein',
        price: 50,
        rating: 3,
        amount: 0,
        category: 'wool',
        /*img: {
            url:,
            alt:
            width:,
            height:
        }*/
    },
    {
        id: 1,
        name: 'Silk Skein',
        price: 65,
        rating: 4,
        amount: 0,
        category: 'silk',
        /*img: {
            url:,
            alt:
            width:,
            height:
        }*/
    }
   /*{
        id: 1,
        name:,
        price:,
        rating:,
        amount:,
        category:,
        img: {
            url:,
            alt:
            width:,
            height:
        }
    }*/
]

// ----------------------------
// --- HTML ELEMENTS ----------
// ----------------------------
const productListContainer = document.querySelector('#product-list');

// Skapa en funktion som skapar html-element för all produkter
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