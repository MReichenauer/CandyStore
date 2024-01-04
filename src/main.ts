import 'bootstrap/dist/css/bootstrap.css';
import './style.css'

import { reloadPage } from './checkout.ts';
import {addCartNumtoLocal} from './cart.ts'
import {addCartToLocal} from './cart.ts'
import {addCartToDOM} from './cart.ts'
import {summaCartFunc} from './cart.ts'
import { fetchProducts } from './api.ts';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: {
    thumbnail: string;
    large: string;
  };
  stock_quantity: number
}
fetchProducts();

document.addEventListener('DOMContentLoaded', function () {
  const hamburgerMenu = document.getElementById('hamburger-menu') as HTMLDivElement;
  const mainNav = document.getElementById('mainNav') as HTMLUListElement;

  hamburgerMenu.addEventListener('click', function () {
    mainNav.classList.toggle('show');
  });
});

const startOfHomeEL = document.querySelector("#toppen") as HTMLButtonElement;
startOfHomeEL.addEventListener("click", () => {

   // See if the use is on the index page (Product overview).
   if (window.location.pathname !== "/index.html") {
  // If not, go to it.
   window.location.href = "index.html";
    } else {
        // Else just scroll to the top of the page.
        reloadPage()
    }
});




function createProductCard(product: Product): HTMLElement {
  // Creating a div for the product card
  const cardEL = document.createElement('div');
  cardEL.classList.add('card', 'product-wrap', 'border-2', 'card-size', 'buy-btn');

// Creating a p for stock quantity
const stockQuantityEl = document.createElement('p');
stockQuantityEl.classList.add('stockStatus');
if (product.stock_quantity !== null && product.stock_quantity > 0) {
  stockQuantityEl.textContent = `Lagerstatus: ${product.stock_quantity} st`;
} else {
  stockQuantityEl.textContent = 'Lagerstatus: 0 st';
}
    

  //Creating a img for the thumbnail
  const thumbnailEL = document.createElement('img');
  thumbnailEL.classList.add('card-img-top', 'card-img', 'img-size');
  thumbnailEL.src = `https://www.bortakvall.se${product.images.thumbnail}`;
  

  // Creating a div for the card body 
  const cardBodyEL = document.createElement('div');
  cardBodyEL.classList.add('card-body');

  // Creating a p for the title of the product
  const titleEL = document.createElement('p');
  titleEL.classList.add('card-title');
  titleEL.textContent = product.name;

  // Creating a p for the price of the product
  const priceEL = document.createElement('p');
  priceEL.classList.add('card-text', 'text-dark');
  priceEL.textContent = `Pris: ${product.price} kr per skopa`;

   // Creating a button to move product to cart
  const addToCartEL = document.createElement('button');
  addToCartEL.classList.add('btn', 'btn-success', 'addToCartBtn');
  //Set the button disabled if the product status null/outofstock
  if (product.stock_quantity === null) {
    addToCartEL.setAttribute("disabled", "disabled");
  }
  addToCartEL.textContent = 'Lägg till';

  const moreInfoEL = document.createElement('button');
  moreInfoEL.classList.add('btn', 'btn-outline-info', 'infoButton');
  moreInfoEL.textContent = 'Info';
  moreInfoEL.addEventListener('click', () => {
    showProductInfo(product);
  });

  // Append elements to their respectiev parents
  cardBodyEL.appendChild(titleEL);
  cardBodyEL.appendChild(priceEL);
  cardBodyEL.appendChild(stockQuantityEl);
  cardBodyEL.appendChild(addToCartEL);
  cardBodyEL.appendChild(moreInfoEL);
  cardEL.appendChild(thumbnailEL);
  cardEL.appendChild(cardBodyEL);

  // Returing the created card
  return cardEL;
}

function showProductInfo(product: Product) {
  // Create a custom modal container
  const modalContainerEL = document.createElement('div');
  modalContainerEL.classList.add('custom-modal', 'show');

  // Create elements for large image and description
  const largeImageEL = document.createElement('img');
  largeImageEL.src = `https://www.bortakvall.se${product.images.large}`;
  
  // Create elements for desciption
  const descriptionEL = document.createElement('div');
  descriptionEL.classList.add('modal-body');
  descriptionEL.innerHTML =` Namn: ${product.name} <br><br> ${product.description} `;

  // Create element for articel number (Artikel nummer)
  const productIdEL = document.createElement('p');
  productIdEL.textContent = `Artikel nummer: ${product.id}`;
  descriptionEL.appendChild(productIdEL);

  //Create a p for stock quantity
    const stockQuantityEl = document.createElement('p');
    // stockQuantityEl.classList.add('stockStatus');
    if (product.stock_quantity !== null && product.stock_quantity > 0) {
      stockQuantityEl.textContent = `Lagerstatus: ${product.stock_quantity} st`;
    } else {
      stockQuantityEl.textContent = 'Lagerstatus: 0 st';
    }
    descriptionEL.appendChild(stockQuantityEl);

  // Create a close button for the custom modal
  const closeButtonEL = document.createElement('button');
  closeButtonEL.type = 'button';
  closeButtonEL.classList.add('btn', 'btn-outline-danger');
  closeButtonEL.textContent = 'Close';
  closeButtonEL.addEventListener('click', () => {
    modalContainerEL.classList.remove('show');
    document.body.removeChild(modalContainerEL);
  });

  // Append elements to the custom modal container
  modalContainerEL.appendChild(largeImageEL);
  modalContainerEL.appendChild(descriptionEL);
  modalContainerEL.appendChild(closeButtonEL);

  // Append the custom modal container to the body
  document.body.appendChild(modalContainerEL);
}

export async function renderProducts() {
  const productListContainerEL = document.getElementById('product-list-container');
  const totalCandysEl = document.getElementById('Antal-godissorter');
  
  try {
    const products = await fetchProducts();
    let outOfStockCount = 0;
    console.log(outOfStockCount);
    const { totalItemsFromAPI, outOfStockCount: stockCount } = products.reduce(
      (inStockApiPerProduct, currentProduct) => {
        if (currentProduct.stock_quantity !== null && currentProduct.stock_quantity > 0) {
          inStockApiPerProduct.totalItemsFromAPI += 1;
        } else {
          inStockApiPerProduct.outOfStockCount += 1; 
        }
        return inStockApiPerProduct;
      },
      { totalItemsFromAPI: 0, outOfStockCount: 0 } 
    );
    console.log(stockCount);
    
    const allProducts = products.reduce((total: number) => total + 1, 0);
     // Showing the number of available products/out of stock
     totalCandysEl!.innerHTML = `Vi erbjuder ${allProducts} olika sorter av godis!<br> För närvarande har vi ${totalItemsFromAPI} olika sorter i lager.`;


    

   

    // Sort products alphabetic
    products.sort((a, b) => a.name.localeCompare(b.name));

    // Create a bootstrap container (grid)
    const gridContainerEL = document.createElement('div');
    gridContainerEL.classList.add('row', 'g-3', 'mx-3', 'allProducts');

    // Create a bootstrap column for each card (product)
    products.forEach((product: Product) => {
      const columnEL = document.createElement('div');
      let idAttri = document.createAttribute('data-id');
      idAttri.value = String(product.id);  
      columnEL.classList.add('col-12', 'col-sm-6', 'col-md-6', 'col-lg-3', 'product-cards');
      columnEL.setAttributeNode(idAttri);
    

      // Create product card and append it to the column
      const cardEL = createProductCard(product);
      columnEL.appendChild(cardEL);

      // Appending colunm to the grid container
      gridContainerEL.appendChild(columnEL);
    });

    // Appending grid container to the product list container
    productListContainerEL?.appendChild(gridContainerEL);
  } catch (error) {
    alert ('Error when loading products, please reload the page!')
  }
    // Output cart from localstorage
    addCartNumtoLocal();
    addCartToLocal();
    addCartToDOM();
    summaCartFunc();
}

// Call render products when the DOM page is loaded
document.addEventListener('DOMContentLoaded', renderProducts);

    

