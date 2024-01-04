import './style.css'
import { closeShoppingCart } from "./cart.ts"
import { addCartToLocal } from './cart.ts';
// import { NewOrder } from './types';
import { fetchProducts } from './api.ts';
// import { createOrder } from './api.ts';

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Queryselectors for different HTML elements

const checkOutCartEl = document.querySelector("#checkOutCart") as HTMLElement;
const shopMoreBtn = document.querySelector("#shopMore") as HTMLElement;
const landingPage = document.querySelector("#landingPage") as HTMLElement;
const basketCheckOutBtn = document.querySelector("#toCashierBtn") as HTMLElement;
const mainPage = document.querySelector("#mainPageAndBasket") as HTMLElement;
const resetBtn = document.querySelector("#resetBtn") as HTMLElement;
const formInput = document.querySelector("#customerDetails") as HTMLElement;
let shoppingCartEl = document.querySelector<HTMLElement>("#shoppingCart")!;
let cartIconEl = document.querySelector("#cartIcon");
const customerInformation = document.querySelector("#customerInformation") as HTMLElement;
export const orderNumber = document.querySelector("#orderNumber") as HTMLElement;
export const orderNumberTwo = document.querySelector("#orderNumberTwo") as HTMLElement;
const dateAndTime = document.querySelector("#dateAndTime") as HTMLElement;
const scrollToTopOfPage = document.querySelector("#scrollToTopOfPage") as HTMLButtonElement;

//--------------------------------------------------------------------------------------------------------------------------------------------------
// function for eventlistener to navigate to checkout cart and back
fetchProducts();
function checkOutCartDisplay() {
    checkOutCartEl.style.display = "flex";
    mainPage.style.display = "none";
};

export function checkOutCartDisplayNone() {
    checkOutCartEl.style.display = "none";
    mainPage.style.display = "block";
};

function checkOutLandingPage() {
    landingPage.style.display = "block";
    checkOutCartEl.style.display = "none";
    scrollToTopOfPage.style.display = "none";
}

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Event listeners for buttons in checkout

shopMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
    checkOutCartDisplayNone();
    cartIconEl?.classList.remove("noShow");
    closeShoppingCart();
});

basketCheckOutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
    closeShoppingCart();
    shoppingCartEl.classList.toggle("noShow");
    checkOutCartDisplay();
});

formInput.addEventListener('submit', function (event) {
    let paymentOption = document.getElementsByName('paymentOption')[0] as HTMLSelectElement;
    
    // If customer has chosen a payment method, this will run
    if (paymentOption.selectedIndex !== 0) {
        event.preventDefault();
        checkOutLandingPage();
        addCartToLocal();
        scrollToTop();
        readFormInput();
        timeForOrder();
    }

    // If customer has not chosen a payment method then this alert will run
    if (paymentOption.selectedIndex === 0) {
        event.preventDefault();
        alert("Vänligen välj en giltig betalningsmetod.");
        return
    }
});

scrollToTopOfPage.addEventListener("click", (e)=> {
    e.preventDefault();
    scrollToTop();
});

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Form input value to be read and displayed in order confirmation

function readFormInput() {

    let customerFirstName = document.getElementById('customerFirstName') as HTMLInputElement | null;
    let customerLastName = document.getElementById('customerLastName') as HTMLInputElement | null;
    let customerAddress = document.getElementById('customerAddress') as HTMLInputElement | null;
    let customerCity = document.getElementById('customerCity') as HTMLInputElement | null;
    let customerZipCode = document.getElementById('customerZipCode') as HTMLInputElement | null;
    let customerPhoneNumber = document.getElementById('customerPhoneNumber') as HTMLInputElement | null;
    let customerEmail = document.getElementById('customerEmail') as HTMLInputElement | null;
    let customerPaymentOption = document.getElementById('paymentOpt') as HTMLInputElement | null;

    customerInformation.innerHTML += `<p>Beställare: ${customerFirstName?.value} ${customerLastName?.value}</p>
<p>Leverans address: ${customerAddress?.value}</p>
<p>Postnummer, Ort: ${customerZipCode?.value}, ${customerCity?.value}</p>
<p>Telefon nummer: ${customerPhoneNumber?.value}</p>
<p>Email address: ${customerEmail?.value}</p>
<p>Betalsätt: ${customerPaymentOption?.value}</p>`
};

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Function to give order confirmation receipt number from API
    
    

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Function to scroll to top when pressing go to checkout and submit order button

export function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Function to display date and time when order is submitted

function timeForOrder() {
    const now = new Date();
    dateAndTime.innerHTML = `Orderdatum: ${now.toLocaleDateString()} kl: ${now.toLocaleTimeString()}`
};

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Function and eventlistener for resetting website in landing page after order is processed

export function reloadPage() {
    location.reload();
}

resetBtn.addEventListener("click", () => {
    localStorage.clear();
    reloadPage();
});