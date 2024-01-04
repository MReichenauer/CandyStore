import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { Cart, NewOrder } from './types';
import { addPro } from './cart.ts';
import { createOrder } from './api.ts';

const formCustomerDetailsEl = document.querySelector<HTMLFormElement>("#customerDetails")!;
const customerFirstNameEl = document.querySelector<HTMLInputElement>("#customerFirstName")!;
const customerLastNameEl = document.querySelector<HTMLInputElement>("#customerLastName")!;
const custStreetAddEl = document.querySelector<HTMLInputElement>("#customerAddress")!;
const custCityEl = document.querySelector<HTMLInputElement>("#customerCity")!;
const custZipCodeEl = document.querySelector<HTMLInputElement>("#customerZipCode")!;
const custTelephoneEl = document.querySelector<HTMLInputElement>("#customerPhoneNumber")!;
const custEmailEl = document.querySelector<HTMLInputElement>("#customerEmail")!;
const orderOverviewTotalSumEl = document.querySelector<HTMLHeadingElement>("#orderOverviewTotalSum")!;

formCustomerDetailsEl?.addEventListener("submit", async (e) => {
    e.preventDefault();

const json = localStorage.getItem("cart") || "[]";
let cart: Cart[] = JSON.parse(json);

    addPro();

    const customerFirstName = customerFirstNameEl?.value || "";
    const customerLastName = customerLastNameEl?.value || "";
    const custAddress = custStreetAddEl?.value;
    const custCity = custCityEl?.value;
    const custZipCode = custZipCodeEl?.value;
    const custTelephone = custTelephoneEl?.value;
    const custEmail = custEmailEl?.value;
    const custOrderTotal = orderOverviewTotalSumEl?.innerText;

    const orderItems: NewOrder['order_items'] = [];

    for (const cartItem of cart) {
        const orderItem = {
            product_id: cartItem.id,
            qty: cartItem.quantity,
            item_price: (cartItem.price),
            item_total: cartItem.quantity * (cartItem.price),
        };

        orderItems.push(orderItem);
    }

    const newOrder: NewOrder = {
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_address: custAddress,
        customer_postcode: custZipCode,
        customer_city: custCity,
        customer_email: custEmail,
        customer_phone: custTelephone,
        order_total: custOrderTotal,
        order_items: orderItems,
    };

    try {
        await createOrder(newOrder);
    } catch (err) {
        alert("Could not create order. Please check the server.");
    }
});