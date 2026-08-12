/**
 * Paystack payment helpers (hosted checkout).
 * Docs: https://paystack.com/docs/api/transaction/
 *
 * Amounts are always passed to Paystack in the smallest currency unit
 * (for KES, cents — multiply the KES amount by 100).
 */

const BASE = "https://api.paystack.co";

export function paystackSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

export function paystackWebhookSecret() {
  return process.env.PAYSTACK_WEBHOOK_SECRET ?? paystackSecretKey();
}

/** Public base URL for the Paystack redirect callback (no trailing slash). */
export function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

/** KES per USD used for estimates & charges. */
export function usdToKesRate() {
  const n = Number(process.env.USD_TO_KES_RATE);
  return Number.isFinite(n) && n > 0 ? n : 130;
}

/** Percentage of the estimate collected to secure a booking. */
export function depositPercent() {
  const n = Number(process.env.BOOKING_DEPOSIT_PERCENT);
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : 20;
}

type InitializeParams = {
  email: string;
  /** Amount in KES (the function converts to cents for Paystack). */
  amountKes: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type InitializedPayment = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializePaystackPayment({
  email,
  amountKes,
  reference,
  callbackUrl,
  metadata,
}: InitializeParams): Promise<InitializedPayment> {
  const secret = paystackSecretKey();
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountKes * 100),
      currency: "KES",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: InitializedPayment;
  };

  if (!data.status || !data.data?.authorization_url) {
    throw new Error(data.message ?? "Payment could not be initialized.");
  }
  return data.data;
}

export type PaystackVerification = {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned" | "pending" | (string & {});
    reference: string;
    amount: number;
    currency: string;
    channel?: string;
    gateway_response?: string;
    paid_at?: string;
    customer?: { email?: string };
  };
};

export async function verifyPaystackTransaction(
  reference: string,
): Promise<PaystackVerification> {
  const secret = paystackSecretKey();
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured.");

  const res = await fetch(
    `${BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
  );
  return (await res.json()) as PaystackVerification;
}
