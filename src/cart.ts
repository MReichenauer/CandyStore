import './style.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Product } from './main.js';
import { renderProducts } from './main.js'
import { fetchProducts } from './api.ts'
import { Cart } from './types';


fetchProducts();

const json = localStorage.getItem("cart") || "[]";
let cart: Cart[] = JSON.parse(json);

const prodListContEl = document.querySelector<HTMLDivElement>("#product-list-container")!;
const closeCartBtnEl = document.querySelector<HTMLButtonElement>("#closeCartBtn")!;
const cartIconEl = document.querySelector<HTMLDivElement>("#cartIcon")!;
const cartNumEl = document.querySelector<HTMLSpanElement>("#cartNum")!;
const cartSummaEl = document.querySelector<HTMLParagraphElement>("#cartSumma")!;
const shoppingCartEl = document.querySelector<HTMLDivElement>("#shoppingCart")!;
const cartListEl = document.querySelector<HTMLUListElement>("#cartList")!;
const cartListOverviewEl = document.querySelector<HTMLUListElement>("#cartListOverview")!;
const cartListTotalResultEl = document.querySelector<HTMLUListElement>("#cartListTotalResult")!;
const orderOverviewTotalSumEl = document.querySelector<HTMLDivElement>("#orderOverviewTotalSum")!;
const orderResultSumEl = document.querySelector<HTMLParagraphElement>("#orderResultSum")!;
const submitOrderBtn = document.querySelector<HTMLButtonElement>("#submitOrder")!;
const basketCheckOutBtn = document.querySelector<HTMLButtonElement>("#toCashierBtn")!;

export const addPro = () => {
     prodListContEl?.addEventListener("click", (e) => {
          let clickTarget = e.target as HTMLButtonElement;
          if (clickTarget.classList.contains('addToCartBtn')) {
               let productID = Number(clickTarget.parentElement!.parentElement!.parentElement!.dataset.id);

               addToCart(productID);
               renderProducts();
               summaCartFunc();
          }

          addCartToLocal();
     })
}
addPro();

if (cart.length === 0) {
     basketCheckOutBtn?.setAttribute("disabled", "disabled");
}

//Adding the product to the cart array
export const addToCart = (productID: number) => {

     fetchProducts()
    .then((products: Product[]) => {
     let findItem = cart.findIndex((item) => item.id === productID);

     products.forEach(product => {
          if (product.id === productID) {

               if (cart.length <= 0) {  //If the cart empty
                    cart = [{
                         id: productID,
                         quantity: 1,
                         price: product.price
                    }];

               } else if (cart.length > 0 && findItem < 0) {  //If the cart filled with a product, but user gonna add other product which is not same as in the cart
                    cart.push({
                         id: productID,
                         quantity: 1,
                         price: product.price
                    });
               } else {
                    cart[findItem].quantity = cart[findItem].quantity + 1;
               }

               basketCheckOutBtn?.removeAttribute("disabled");
          }
     })

     addCartNumtoLocal();
     addCartToLocal();
     addCartToDOM();
})
.catch((error) => {
  // Handle errors here
  console.error(error);
});
};

//Save the shopping cart to the local storage
export const addCartToLocal = () => {
     localStorage.setItem("cart", JSON.stringify(cart));
}

//Save the number on shoppingcart icon to local storage
export const addCartNumtoLocal = () => {
     let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
     localStorage.setItem("number", JSON.stringify(totalQuantity));
     cartNumEl!.innerText = `${totalQuantity}`;
}

//Send all products from the shopping cart to the DOM
export const addCartToDOM = () => {
     fetchProducts()
     .then((products: Product[]) => {
     cartListEl.innerHTML = '';
     cartListOverviewEl.innerHTML = '';
     cartListTotalResultEl.innerHTML = '';

     if (cart.length > 0) {
          cart.forEach(item => {
               let findProduct = products.findIndex((product) => product.id === item.id);
               let productIndex = products[findProduct];

               cartListEl.innerHTML += `<li class="listProduct" data-id="${item.id}">                 
                    <div class="itemCart">
                    <div>
                    <img src="https://www.bortakvall.se${productIndex.images.thumbnail}">
                    </div>
                    <div class="detailCart">
                    <p>${productIndex.name}</p>
                    <p> ${productIndex.price} kr</p>
                    <p><i class="fa-solid fa-square-minus minus"></i>${item.quantity}<i class="fa-solid fa-square-plus plus"></i></p>
                    </div>
                    </div>
                    <div class="delTotal">
                    <i class="fa-solid fa-trash-arrow-up deleteProd"></i>     
                    <p>${productIndex.price * item.quantity} kr</p>
                    </div> 
                    </li>`

               cartListOverviewEl.innerHTML += `<li class="listProduct" id="listPro" data-id="${item.id}">                 
                    <div class="itemCart">
                    <div>
                    <img src="https://www.bortakvall.se${productIndex.images.thumbnail}">
                    </div>
                    <div class="detailCart">
                    <p>${productIndex.name}</p>
                    <p><span id="detailCart1">${item.quantity} st</span> x <span id="detailCart2">${productIndex.price}</span> kr <br> <span id="delTotal2">Totalt: ${productIndex.price * item.quantity}</span> kr</p>
                    </div>
                    </div>
                    </li>
                    <hr class="hrProductOverview">`

               cartListTotalResultEl.innerHTML += `<li class="listProduct" data-id="${item.id}">                 
                    <div id="landingPageOverviewTotal">
                    <p>${productIndex.name}</p>
                    <div id="amountAndQuantityTotal"><p>${item.quantity}st x ${productIndex.price} kr,    Totalt: ${productIndex.price * item.quantity} kr</p>
                    </div>
                    </li>
                    <hr class="hrProduct">`
          })
     }
})
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
};

//Delete, add & reduce a product on the shopping cart
cartListEl.addEventListener("click", (e) => {
     e.stopPropagation;
     let clickTarget = e.target as HTMLButtonElement;

     let itemID = Number(clickTarget.parentElement!.parentElement!.dataset.id);

     let cartItemInd = cart.findIndex((item) => item.id === itemID);

     let item_id = Number(clickTarget.parentElement!.parentElement!.parentElement!.parentElement!.dataset.id);

     let cartItemInd_2 = cart.findIndex((item) => item.id === item_id);

     //If-statement for delete a product on shoppingcart when user clicked on delete button
     if (clickTarget.classList.contains("deleteProd")) {
          cart.splice(cartItemInd, 1);

          //When the cart is empty after the user delete all products from the cart          
          if (cart.length === 0) {
               basketCheckOutBtn?.setAttribute("disabled", "disabled");
          }

          //This is for reducing a product on shoppingcart when user clicked on minus button
     } else if (clickTarget.classList.contains("minus") && cart[cartItemInd_2].quantity > 0) {

          cart[cartItemInd_2].quantity = cart[cartItemInd_2].quantity - 1

          //When the user clicked on a product & the quantity was left 0, then the product should be deleted from shoppingcart as well 
          if (clickTarget.classList.contains("minus") && cart[cartItemInd_2].quantity == 0) {
               cart.splice(cartItemInd_2, 1);
               if (cart.length === 0) {
                    basketCheckOutBtn?.setAttribute("disabled", "disabled");
               }
          }

          //This is for adding a product on shoppingcart when user clicked on plus button
     } else if (clickTarget.classList.contains("plus")) {

          cart[cartItemInd_2].quantity = cart[cartItemInd_2].quantity + 1
          addCartToLocal();
          addCartNumtoLocal();
     }

     addCartToDOM();
     summaCartFunc();
     addCartToLocal();
     addCartNumtoLocal();
})

//--------------------------------------------------------------------------------------------------------------------------------------------------

//When user clicked on close button on shoppingcart
export const closeShoppingCart = () => {
     closeCartBtnEl?.addEventListener("click", (e) => {
          let targetClick = e.target as HTMLElement;
          let x = targetClick.parentElement!.parentElement;
      console.log(x);
          shoppingCartEl?.classList.toggle("noShow");
          cartIconEl?.classList.remove("noShow");
          
     });
}

closeShoppingCart();

//Showing how many product the user put on the shoppingcart (itShows on shopping cart icon)
cartIconEl?.addEventListener("click", () => {
     shoppingCartEl?.classList.remove("noShow");
     shoppingCartEl?.classList.add("showCart");
     cartIconEl.classList.add("noShow");
})


//Function for counting how much total sum that user has in shopping cart 
export const summaCartFunc = () => {
     const summaCart = cart.reduce((sum, item) => {
          return sum + (item.quantity * item.price);
     }, 0);

     cartSummaEl.innerHTML = `${summaCart} kr`;  //Send the totalsum to the DOM
     orderOverviewTotalSumEl.innerHTML = `${summaCart}`;
     orderResultSumEl.innerHTML = `Totalt belopp: ${summaCart} kr`;
     submitOrderBtn.innerHTML = `Slutför order på: ${summaCart} kr`;
}


