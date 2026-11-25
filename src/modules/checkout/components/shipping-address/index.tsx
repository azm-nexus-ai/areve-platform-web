import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import React, { useEffect, useState } from "react"
import CountrySelect from "../country-select"
import AddressSelect from "../address-select"
import type { DeliveryCoverage } from "@lib/util/delivery-coverage"

const normaliseState = (value?: string | null) => ["lagos", "ng-la"].includes(value?.trim().toLowerCase() ?? "") ? "Lagos" : value || ""

const ShippingAddress = ({
  customer,
  cart,
  coverage,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  coverage: DeliveryCoverage | null
  checked: boolean
  onChange: () => void
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.address_2": cart?.shipping_address?.address_2 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "",
    "shipping_address.province": normaliseState(cart?.shipping_address?.province),
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const addressesInRegion = customer?.addresses.filter(address => cart?.region?.countries?.some(country => country.iso_2 === address.country_code)) ?? []

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.address_2": address?.address_2 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "",
        "shipping_address.province": normaliseState(address?.province),
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart, customer?.email])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ...(e.target.name === "shipping_address.province" ? { "shipping_address.address_2": "" } : {}),
    })
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={addressesInRegion}
            addressInput={
              Object.fromEntries(Object.entries(formData).map(([key, value]) => [key.replace("shipping_address.", ""), value])) as Partial<HttpTypes.StoreCartAddress>
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      {!coverage && <p role="alert" className="mb-6 border border-areve-sand p-4 text-sm leading-6">Online delivery quotes are temporarily unavailable. Please contact AREVÉ before placing an order.</p>}
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <Input label="First name" name="shipping_address.first_name" autoComplete="given-name" value={formData["shipping_address.first_name"]} onChange={handleChange} required data-testid="shipping-first-name-input" />
        <Input label="Last name" name="shipping_address.last_name" autoComplete="family-name" value={formData["shipping_address.last_name"]} onChange={handleChange} required data-testid="shipping-last-name-input" />
        <CountrySelect name="shipping_address.country_code" autoComplete="country" region={cart?.region} value={formData["shipping_address.country_code"]} onChange={handleChange} required data-testid="shipping-country-select" />
        <div><label htmlFor="shipping-state" className="mb-2 block text-sm text-areve-walnut">State</label><select id="shipping-state" name="shipping_address.province" autoComplete="address-level1" value={formData["shipping_address.province"]} onChange={handleChange} required data-testid="shipping-province-input" className="min-h-12 w-full border border-areve-sand bg-transparent px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-areve-walnut">
          <option value="">Select a covered state</option>
          {!!coverage?.lagos_areas.length && <option value="Lagos">Lagos</option>}
          {coverage?.outside_lagos_states.map(state => <option key={state} value={state}>{state}</option>)}
        </select></div>
        {formData["shipping_address.province"].toLowerCase() === "lagos" ? <div><label htmlFor="shipping-area" className="mb-2 block text-sm text-areve-walnut">Area / District</label><select id="shipping-area" name="shipping_address.address_2" autoComplete="address-level2" value={formData["shipping_address.address_2"]} onChange={handleChange} required data-testid="shipping-area-input" className="min-h-12 w-full border border-areve-sand bg-transparent px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-areve-walnut">
          <option value="">Select a covered area</option>
          {coverage?.lagos_areas.map(area => <option key={area.name} value={area.name}>{area.name}</option>)}
        </select></div> : <Input label="Area / District" name="shipping_address.address_2" autoComplete="address-level2" value={formData["shipping_address.address_2"]} onChange={handleChange} required data-testid="shipping-area-input" />}
        <Input label="City" name="shipping_address.city" autoComplete="address-level2" value={formData["shipping_address.city"]} onChange={handleChange} required data-testid="shipping-city-input" />
        <div className="small:col-span-2"><Input label="Street address" name="shipping_address.address_1" autoComplete="address-line1" value={formData["shipping_address.address_1"]} onChange={handleChange} required data-testid="shipping-address-input" /></div>
        <Input label="Postal code (optional)" name="shipping_address.postal_code" autoComplete="postal-code" value={formData["shipping_address.postal_code"]} onChange={handleChange} data-testid="shipping-postal-code-input" />
        <Input label="Company (optional)" name="shipping_address.company" autoComplete="organization" value={formData["shipping_address.company"]} onChange={handleChange} data-testid="shipping-company-input" />
      </div>
      <p className="mt-4 text-xs leading-6 text-areve-walnut">Delivery is quoted for your selected state and area. If your location is not listed, contact AREVÉ to confirm availability.</p>
      <div className="my-8">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Phone"
          type="tel"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
