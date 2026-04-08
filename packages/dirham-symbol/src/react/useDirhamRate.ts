import { useCallback, useEffect, useRef, useState } from "react";
import { clearRateCache, fetchExchangeRates } from "../core/conversion";

export interface UseDirhamRateResult {
	/** The exchange rate (AED → target currency). `undefined` while loading. */
	rate: number | undefined;
	/** Whether rates are currently being fetched. */
	loading: boolean;
	/** Error message if the fetch failed. */
	error: string | undefined;
	/** Re-fetch the exchange rates (clears cache). */
	refetch: () => void;
	/** Convert an AED amount to the target currency using the fetched rate. */
	convert: (amount: number) => number | undefined;
	/** Convert from the target currency back to AED using the fetched rate. */
	convertBack: (amount: number) => number | undefined;
}

/**
 * React hook that fetches and caches the AED exchange rate for a given currency.
 *
 * @example
 * ```tsx
 * import { useDirhamRate } from "dirham/react";
 *
 * function PriceConverter() {
 *   const { rate, loading, convert } = useDirhamRate("USD");
 *
 *   if (loading) return <span>Loading...</span>;
 *   return <span>100 AED = {convert(100)} USD</span>;
 * }
 * ```
 */
export function useDirhamRate(currency: string): UseDirhamRateResult {
	const [rate, setRate] = useState<number | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | undefined>(undefined);
	const mountedRef = useRef(true);

	const code = currency.toUpperCase();

	const doFetch = useCallback(() => {
		setLoading(true);
		setError(undefined);
		fetchExchangeRates()
			.then((rates) => {
				if (!mountedRef.current) return;
				const r = rates[code];
				if (r === undefined) {
					setError(`Unknown currency code: ${code}`);
					setRate(undefined);
				} else {
					setRate(r);
				}
			})
			.catch((err: unknown) => {
				if (!mountedRef.current) return;
				setError(err instanceof Error ? err.message : String(err));
				setRate(undefined);
			})
			.finally(() => {
				if (mountedRef.current) setLoading(false);
			});
	}, [code]);

	useEffect(() => {
		mountedRef.current = true;
		doFetch();
		return () => {
			mountedRef.current = false;
		};
	}, [doFetch]);

	const refetch = useCallback(() => {
		clearRateCache();
		doFetch();
	}, [doFetch]);

	const convert = useCallback(
		(amount: number): number | undefined => {
			if (rate === undefined) return undefined;
			const factor = 100;
			return Math.round(amount * rate * factor) / factor;
		},
		[rate],
	);

	const convertBack = useCallback(
		(amount: number): number | undefined => {
			if (rate === undefined || rate === 0) return undefined;
			const factor = 100;
			return Math.round((amount / rate) * factor) / factor;
		},
		[rate],
	);

	return { rate, loading, error, refetch, convert, convertBack };
}
