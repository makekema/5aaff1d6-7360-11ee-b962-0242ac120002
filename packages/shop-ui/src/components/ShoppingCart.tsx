import React, { useContext, useState, useRef, useEffect } from "react"
import { ShopContext } from "../ShopContext"
import { InlineProgressIndicator } from "./progress-indicators/InlineProgressIndicator"
import { CartViewModel, UseCaseDefinitions } from "@bikeshop/shop"
import { CheckoutModal } from "./CheckoutModal"

export function ShoppingCart({ viewModel }: { viewModel: CartViewModel }) {
   const [isModalOpen, setModalOpen] = useState<boolean>(false)

   const handleCloseModal = () => {
      setModalOpen(false)
   }

   const cartBikesTableRows = viewModel.bikes.map((bike) => (
      <tr key={bike.ean}>
         <td className="">{bike.name}</td>
         <td className="text-right">{bike.count}</td>
         <td className="text-right">{bike.price}</td>
         <td className="">
            <RemoveBikeFromCartButton ean={bike.ean} />
         </td>
      </tr>
   ))

   return (
      <div
         className="column"
         style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
      >
         {!isModalOpen && (
            <div className="card">
               <header>
                  <h4>Shopping cart</h4>
               </header>
               <hr />
               <table className="table-auto">
                  <tbody>
                     {cartBikesTableRows}
                     {viewModel.bikes.length > 1 ||
                     viewModel.bikes.some((bike) => bike.count > 1) ? (
                        <tr>
                           <td className="">Discount</td>
                           <td className="text-right">
                              {viewModel.discountInPercent} %
                           </td>
                           <td className="text-right">-{viewModel.discount}</td>
                        </tr>
                     ) : null}
                     <tr
                        style={{
                           borderTop: "1px solid var(--color-lightGrey)",
                        }}
                     >
                        <td>
                           <b>Total:</b>
                        </td>
                        <td />
                        <td className="text-right">
                           <b>{viewModel.totalPrice}</b>
                        </td>
                        <td />
                     </tr>
                  </tbody>
               </table>
               {!isModalOpen && <CheckoutButton setModalOpen={setModalOpen} />}
            </div>
         )}
         {isModalOpen && (
            <CheckoutModal onClose={handleCloseModal} viewModel={viewModel} />
         )}
      </div>
   )
}

function RemoveBikeFromCartButton(props: { ean: number }) {
   const [isLoading, setLoading] = useState(false)
   const shopContext = useContext(ShopContext)
   const isMountedRef = useRef(true)

   useEffect(() => {
      return () => {
         isMountedRef.current = false
      }
   }, [])

   const handleRemove = async () => {
      setLoading(true)
      await shopContext.controller?.executeUseCase(
         UseCaseDefinitions.RemoveBikeFromCart.name,
         {
            ean: props.ean,
         }
      )
      if (isMountedRef.current) {
         setLoading(false)
      }
   }

   return (
      <button
         disabled={isLoading}
         className="button icon-only"
         onClick={handleRemove}
      >
         <RemoveFromCartSvgIcon color="steelblue" />
         {isLoading && <InlineProgressIndicator />}
      </button>
   )
}

function RemoveFromCartSvgIcon(props: { color: string }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         fill={props.color ?? "black"}
         width="18px"
         height="18px"
      >
         <path d="M22.73 22.73L2.77 2.77 2 2l-.73-.73L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38c-.5.36-.83.95-.83 1.62 0 1.1.89 2 1.99 2 .67 0 1.26-.33 1.62-.84L21.46 24l1.27-1.27zM7.42 15c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h2.36l2 2H7.42zm8.13-2c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H6.54l9.01 9zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z" />
         <path d="M0 0h24v24H0z" fill="none" />
      </svg>
   )
}

function CheckoutButton(props: { setModalOpen: (isOpen: boolean) => void }) {
   const handleCheckout = () => {
      props.setModalOpen(true)
   }

   return (
      <button
         className="button primary"
         onClick={handleCheckout}
         style={{ width: "100%", marginBottom: "1rem" }}
      >
         Checkout
      </button>
   )
}
