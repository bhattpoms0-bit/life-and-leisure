// Business identity supplied by the owner for local policy review.
// The owner has confirmed Delhi as the registered office; Pithoragarh is additional.
export const businessDetails = {
  brandName: 'Life & Leisure Travel',
  legalName: 'LIFE & LEISURE INDIA PRIVATE LIMITED',
  tradeName: 'LIFE & LEISURE INDIA PRIVATE LIMITED',
  gstin: '07AANCM4800A1ZV',
  website: 'https://lifeandleisure.travel',
  email: 'enquiries@lifeandleisure.travel',
  offices: [
    { label: 'Registered office (Delhi)', lines: ['107-108, 1st Floor,', 'Roots Tower,', 'District Centre, Laxmi Nagar,', 'Delhi - 110092, India'] },
    { label: 'Additional office (Pithoragarh)', lines: ['Netcom Cyber,', 'Meghna Complex,', 'Simalgair Market,', 'Siltham,', 'Pithoragarh - 262501,', 'Uttarakhand, India'] },
  ],
  phone: null,
  address: null,
  supportHours: null,
  policies: [{ label: 'Privacy Policy', to: '/privacy-policy' }], // Local draft; policy approval is separate.
  trustInformation: [], // Approved factual statements; no invented credentials
}
