/** Single source of truth for the business's contact details. */

export const WHATSAPP_NUMBER = "254715135141"; // digits only, no "+"
export const WHATSAPP_DISPLAY = "+254 715 135 141";
export const WHATSAPP_MESSAGE =
  "Hello Karen Adventures! I'd like to plan a journey.";

/** Deep link that opens WhatsApp with a pre-filled message. */
export function whatsappLink(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CONTACT_EMAIL = "booking@karenadventures.com";
export const CONTACT_PHONE_DISPLAY = WHATSAPP_DISPLAY;
