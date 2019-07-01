// set variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-btn');
const clearCartBtn = document.querySelector('.clear-btn');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartContent = document.getElementById('cart-content');
const productsDOM = document.getElementById('products-center');

// set
let cart = [];

let buttonsDOM = [];

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
        // Getting the add to cart buttons/ looping through to get id
    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText = 'In Cart';
                event.target.disabled = true;
                // get products from product and add the amount property and set to 1
                let cartItem = {...Storage.getProduct(id), amount: 1 };

                // add products to the cart
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);

                // set cart values
                this.setCartValues(cart);

                // display cart items
                this.addCartItem(cartItem);

                // show the cart
                this.showCart();
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        // update values
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src="./images/product-1.jpeg" alt="product" />
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${
                          item.id
                        }>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount" data-id=${item.id}>
                            1
                        </p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>
        `;
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
}

// store products in local storage
class Storage {
    // static methods
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// setup DOM
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products
        .getProducts()
        .then(products => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.getBagButtons();
        });
});