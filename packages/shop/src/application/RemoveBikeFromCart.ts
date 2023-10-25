import { DisplaysCart } from "./interfaces/DisplaysCart"
import { LoadsCart } from "./interfaces/LoadsCart"
import { StoresCart } from "./interfaces/StoresCart"
import { Cart } from "../domain/Cart"
import { PresentableCart } from "./models/PresentableCart"
import { RemoveBikeFromCartInput } from "./RemoveBikeFromCart.input"

export class RemoveBikeFromCart {
   private _ui: DisplaysCart
   private _cartStorage: LoadsCart & StoresCart

   constructor(ui: DisplaysCart, cart: StoresCart & LoadsCart) {
      this._ui = ui
      this._cartStorage = cart
   }

   public execute(input: RemoveBikeFromCartInput): void {
      try {
         const cart = this._cartStorage.load()
         cart.removeProductByEan(input.ean)
         this._cartStorage.store(cart)

         const output = RemoveBikeFromCart.createOutputFromCart(cart)
         this._ui.displayCart(output)
      } catch (e) {
         console.error("Could not remove bike with ean: " + input.ean, e)
      }
   }

   //Why not put these in cart to make code more DRY
   private static createOutputFromCart(cart: Cart): PresentableCart {
      return {
         bikes: cart.products.map((product) => {
            return {
               count: product.count,
               ean: product.ean,
               name: product.name,
               price: product.price,
            }
         }),
         discount: RemoveBikeFromCart.calculateDiscount(cart),
         discountInDecimal: cart.cartConfiguration.discountInDecimal,
         totalPrice: RemoveBikeFromCart.calculateTotalPrice(cart),
      }
   }

   private static calculateTotalPrice(cart: Cart) {
      const discountFactor = cart.isEligibleForDiscount()
         ? 1 - cart.cartConfiguration.discountInDecimal
         : 1
      return cart.products.reduce<number>((sum, product) => {
         return sum + product.price * product.count * discountFactor
      }, 0)
   }

   private static calculateDiscount(cart: Cart) {
      return (
         cart.products.reduce<number>((sum, product) => {
            return sum + product.price * product.count
         }, 0) * cart.cartConfiguration.discountInDecimal
      )
   }
}
