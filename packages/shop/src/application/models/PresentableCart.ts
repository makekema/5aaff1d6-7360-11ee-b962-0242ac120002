export type PresentableCart = {
   bikes: Array<PresentableCartBike>
   totalPrice: number
   discount: number
   discountInDecimal: number
}

export type PresentableCartBike = {
   count: number
   ean: number
   name: string
   price: number
}
