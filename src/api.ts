import { Product } from "./main";
import { orderNumber } from "./checkout";
import { orderNumberTwo } from "./checkout";
import { NewOrder } from "./types";

export function fetchProducts(): Promise<Product[]> {
    return fetch('https://www.bortakvall.se/api/v2/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error when loading products, please reload the page!');
        }
        return response.json();
      })
      .then(({ data }) => {
        return data;
      })
      .catch((error) => {
        alert(error.message);
        throw error;
      });
  }

  export const createOrder = async (newOrder: NewOrder) => {
	try {
	  const res = await fetch("https://www.bortakvall.se/api/v2/users/30/orders", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(newOrder),
	  });
  
	  if (!res.ok) {
		throw new Error(`Could not create order. Status code was: ${res.status}`);
	  } else {
		
		const responseData = await res.json();
  
		
		if (responseData.status === "success") {
		  
		  const orderId: number | undefined = responseData.data?.id;
  
		  
		  localStorage.clear();

		   
          orderNumber.innerHTML = `Ordernummer: ${orderId}`
          orderNumberTwo.innerHTML = `Tack för din beställning! Här kommer din orderbekräftelse med ordernummer: ${orderId}`
		  return orderId;
		} else {
		  
		  
		  return undefined; 
		}
	  }
	} catch (error) {
	  
	  
	  return undefined; 
	}
  };