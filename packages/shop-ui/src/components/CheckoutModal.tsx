import { CartViewModel, CheckoutData } from "@bikeshop/shop"
import { ChangeEvent, FormEvent, useState } from "react"

export function CheckoutModal(props: {
   viewModel: CartViewModel
   onClose: () => void
}) {
   const [checkoutData, setCheckoutData] = useState<CheckoutData>({
      userData: {
         name: "",
         surname: "",
         email: "",
         iban: "",
         bic: "",
      },
      viewModel: props.viewModel,
      agreedToTermsAndConditions: false,
   })

   function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target
      setCheckoutData((prevData) => ({
         ...prevData,
         userData: {
            ...prevData.userData,
            [name]: value,
         },
      }))
   }

   function handleFormSubmit(event: FormEvent) {
      event.preventDefault()
      if (checkoutData.agreedToTermsAndConditions) {
         // User has agreed, proceed with submitting the order:
         // - send the checkoutData object to the backend
         // - perform according db operations
         // - send an order verification
      } else {
         // User has not agreed, display an error or take appropriate action
      }
      // For presentation purposes: see the combined data object
      console.log(checkoutData)
   }

   return (
      <div
         className="card"
         style={{ display: "flex", flexDirection: "column" }}
      >
         <header
            style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "stretch",
            }}
         >
            <h4>Your Payment Data</h4>
            <span
               className="close"
               onClick={props.onClose}
               style={{ padding: "1rem", margin: "-1rem", cursor: "pointer" }}
            >
               &times;
            </span>
         </header>
         <hr style={{ marginTop: 0 }} />
         <form
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            onSubmit={handleFormSubmit}
         >
            <label>
               Name:
               <input
                  type="text"
                  name="name"
                  placeholder="John"
                  required
                  value={checkoutData.userData.name}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               Surname:
               <input
                  type="text"
                  name="surname"
                  placeholder="Doe"
                  required
                  value={checkoutData.userData.surname}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               Email:
               <input
                  type="email"
                  name="email"
                  placeholder="john@doe.com"
                  required
                  value={checkoutData.userData.email}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               IBAN:
               <input
                  type="text"
                  name="iban"
                  placeholder="XXXX XXXX XXXX XXXX XX"
                  required
                  value={checkoutData.userData.iban}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               BIC:
               <input
                  type="text"
                  name="bic"
                  placeholder="XXXXXX1XXX"
                  required
                  value={checkoutData.userData.bic}
                  onChange={handleInputChange}
               />
            </label>
            <label
               style={{
                  display: "flex",
                  gap: "1rem",
                  lineHeight: "1.3",
                  cursor: "pointer",
               }}
            >
               <input
                  type="checkbox"
                  name="agreement"
                  required
                  checked={checkoutData.agreedToTermsAndConditions}
                  onChange={() =>
                     setCheckoutData((prevData) => ({
                        ...prevData,
                        agreedToTermsAndConditions:
                           !prevData.agreedToTermsAndConditions,
                     }))
                  }
               />
               I agree to the terms and conditions.
            </label>
            <button
               className="button primary"
               type="submit"
               style={{ marginBottom: "1rem" }}
            >
               Submit Your Order
            </button>
         </form>
      </div>
   )
}
