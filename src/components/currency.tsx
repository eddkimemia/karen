"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Currency = "KES" | "USD";

type CurrencyState = {
  /** "KES" for Kenyan visitors, "USD" for everyone else. */
  currency: Currency;
  /** Detected visitor country (ISO-2). */
  country: string;
  /** Live USD→KES rate from the server. */
  usdToKes: number;
  /** True while the visitor currency is being resolved. */
  loading: boolean;
};

const DEFAULT: CurrencyState = {
  currency: "USD",
  country: "KE",
  usdToKes: 130,
  loading: true,
};

const CurrencyContext = createContext<CurrencyState>(DEFAULT);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CurrencyState>(DEFAULT);

  useEffect(() => {
    let alive = true;
    fetch("/api/currency")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        setState({
          currency: data.currency === "KES" ? "KES" : "USD",
          country: String(data.country ?? "KE"),
          usdToKes: Number(data.usdToKes) || 130,
          loading: false,
        });
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <CurrencyContext.Provider value={state}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtKes = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

/**
 * Renders a USD price in the visitor's currency — KES for Kenyans, USD for
 * the rest of the world.
 */
export function Price({
  usd,
  className,
}: {
  usd: number;
  className?: string;
}) {
  const { currency, usdToKes, loading } = useCurrency();
  if (loading || currency === "USD") {
    return <span className={className}>{fmtUsd(usd)}</span>;
  }
  return <span className={className}>{fmtKes(Math.round(usd * usdToKes))}</span>;
}

/**
 * Full price readout with the secondary currency shown in small print —
 * e.g. "KES 162,500 (US$1,250)" for Kenyans, "US$1,250 (KES 162,500)" abroad.
 */
export function PricePair({
  usd,
  primaryClassName,
  secondaryClassName,
}: {
  usd: number;
  primaryClassName?: string;
  secondaryClassName?: string;
}) {
  const { currency, usdToKes, loading } = useCurrency();
  const kes = Math.round(usd * usdToKes);
  if (loading) return <span className={primaryClassName}>{fmtUsd(usd)}</span>;
  return currency === "KES" ? (
    <span className={primaryClassName}>
      {fmtKes(kes)}{" "}
      <span className={secondaryClassName}>· US${usd.toLocaleString("en-US")}</span>
    </span>
  ) : (
    <span className={primaryClassName}>
      {fmtUsd(usd)}{" "}
      <span className={secondaryClassName}>· {fmtKes(kes)}</span>
    </span>
  );
}