// set variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-btn');
const clearCartBtn = document.querySelector('.clear-btn');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('cart-items');
const cartTotal = document.querySelector('cart-total');
const cartContent = document.querySelector('cart-content');
const productsDOM = document.getElementById('products-center');

// set cart
let cart = [];

// getting the products / async always returns a promise
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            // set the array of items to data variable with products variable
            let products = data.items;
            // set a variable item to the fields with map() iterating through the array
            products = products.map(item => {
                // destructuring the objects from fields
                const { title, price } = item.fields;
                // destructuring the objects from sys
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// displaying the products
class UI {
    displayProducts(products) {
        // set result to empty string
        let result = '';
        // looping through array, getting the objects
        products.forEach(product => {
            // chaining on to the result
            result += `
             <!-- single product -->
             <article class="product">
                <div class="img-container">
                    <img src=${
                      product.image
                    } class="product-img" alt="product" />
                    <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article> 
            <!-- end of single product -->
            `;
        });
        // calling and setting to the DOM
        productsDOM.innerHTML = result;
    }
}

// store products in local storage
class Storage {}

// setup DOM
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products => ui.displayProducts(products));
});