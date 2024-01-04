export interface Cart {
    id: number
    quantity: number
    price: number
}

 interface DetailsOrderProduct {
    product_id: number //harusnya number semua
    qty: number
    item_price: number
    item_total: number
}

export interface NewOrder {
    customer_first_name: string
    customer_last_name: string
    customer_address: string
    customer_postcode: string
    customer_city: string
    customer_email: string
    customer_phone: string
    order_total: string   //harusnya number
    order_items: DetailsOrderProduct[]
    }


            







