import { RemoveBikeFromCart } from "./RemoveBikeFromCart"
import { DisplaysCart } from "./interfaces/DisplaysCart"
import { aBike } from "../domain/Bike.fixture"
import { LoadsCart } from "./interfaces/LoadsCart"
import { StoresCart } from "./interfaces/StoresCart"
import { DisplaysError } from "./interfaces/DisplaysError"
import { Cart } from "../domain/Cart"

describe("AddBikeToCart", () => {
   let emptyCartSpy: LoadsCart & StoresCart
   let twoBikesCartSpy: LoadsCart & StoresCart
   let uiSpy: DisplaysError & DisplaysCart

   let bikeToRemove = {
      ean: 123,
   }

   describe("for an empty cart", () => {
      it("can be executed", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, emptyCartSpy)
         expect(async () => {
            await useCase.execute(bikeToRemove)
         }).not.toThrow()
      })

      it("attempts to removes the bike from the stored cart", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, emptyCartSpy)

         await useCase.execute(bikeToRemove)

         expect(uiSpy.displayError).not.toHaveBeenCalled()
         expect(emptyCartSpy.store).toHaveBeenCalled()
      })

      it("displays an empty shopping cart", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, emptyCartSpy)

         await useCase.execute(bikeToRemove)

         expect(uiSpy.displayError).not.toHaveBeenCalled()
         expect(uiSpy.displayCart).toHaveBeenCalledWith({
            bikes: [],
            discount: 0,
            discountInDecimal: 0.1,
            totalPrice: 0,
         })
      })
   })

   describe("for a filled cart", () => {
      it("can be executed", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, twoBikesCartSpy)

         expect(async () => {
            await useCase.execute(bikeToRemove)
         }).not.toThrow()
      })

      it("removes the bike from the stored cart", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, twoBikesCartSpy)

         await useCase.execute(bikeToRemove)

         expect(uiSpy.displayError).not.toHaveBeenCalled()
         expect(twoBikesCartSpy.store).toHaveBeenCalled()
      })

      it("displays the shopping cart with the remaining bike", async () => {
         const useCase = new RemoveBikeFromCart(uiSpy, twoBikesCartSpy)

         await useCase.execute(bikeToRemove)

         expect(uiSpy.displayError).not.toHaveBeenCalled()
         expect(uiSpy.displayCart).toHaveBeenCalledWith({
            bikes: [
               {
                  count: expect.anything(),
                  ean: expect.anything(),
                  name: expect.anything(),
                  price: 1000,
               },
            ],
            discount: 100,
            discountInDecimal: 0.1,
            totalPrice: 1000,
         })
      })
   })

   beforeEach(() => {
      jest.resetAllMocks()

      emptyCartSpy = {
         store: jest.fn(),
         load: jest.fn().mockReturnValue(new Cart()),
      }

      const filledCartStub = new Cart()
      filledCartStub.addProduct(aBike())
      filledCartStub.addProduct(aBike())

      twoBikesCartSpy = {
         store: jest.fn(),
         load: jest.fn().mockReturnValue(filledCartStub),
      }

      uiSpy = {
         displayError: jest.fn(),
         displayCart: jest.fn(),
      }
   })
})
