import { roundTo } from "./round";
import { assertFiniteAmount } from "./validate";

/**
 * Common exchange rates cache entry.
 */
interface CachedRates {
	timestamp: number;
	rates: Record<string, number>;
}

let _cache: CachedRates | null = null;

/** Default TTL for cached rates: 1 hour */
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Options for currency conversion.
 */
export interface ConvertOptions {
	/**
	 * Number of decimal places for the result.
	 * Rounds half away from zero.
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Custom exchange rate: units of the target currency per 1 AED, the same
	 * direction the rates from {@link fetchExchangeRates} use (about `0.2723` for
	 * USD, not `3.6725`). When provided, skips the network fetch.
	 * Must be a positive, finite number.
	 */
	rate?: number;
}

/**
 * Fetch AED exchange rates from the free open.er-api.com API (no API key).
 * Results are cached in memory for 1 hour.
 *
 * @returns Map of currency code to units of that currency per 1 AED.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
	if (_cache && Date.now() - _cache.timestamp < CACHE_TTL) {
		return _cache.rates;
	}

	const res = await fetch("https://open.er-api.com/v6/latest/AED");

	if (!res.ok) {
		throw new Error(
			`Failed to fetch exchange rates: ${res.status} ${res.statusText}`,
		);
	}

	const data = (await res.json()) as { rates?: Record<string, number> };

	if (!data.rates) {
		throw new Error("Invalid exchange rate response: missing rates");
	}

	_cache = { timestamp: Date.now(), rates: data.rates };
	return data.rates;
}

/**
 * Clear the in-memory exchange rate cache.
 * Useful for testing or forcing a refresh.
 */
export function clearRateCache(): void {
	_cache = null;
}

/**
 * The rate to convert with: the caller's own, or the current one from the API.
 * Either way it must be a positive, finite number, because a zero, negative or
 * NaN rate would silently produce a wrong amount.
 */
async function resolveRate(
	code: string,
	custom: number | undefined,
): Promise<number> {
	let rate = custom;
	if (rate === undefined) {
		rate = (await fetchExchangeRates())[code];
		if (rate === undefined) {
			throw new Error(`Unknown currency code: ${code}`);
		}
	}
	if (rate === 0) {
		throw new RangeError(`Exchange rate for ${code} is zero`);
	}
	if (!Number.isFinite(rate) || rate < 0) {
		throw new RangeError(
			`Exchange rate for ${code} must be a positive, finite number, got ${rate}`,
		);
	}
	return rate;
}

/**
 * Convert an AED amount to another currency.
 *
 * @example
 * ```ts
 * const usd = await convertFromAED(100, "USD");
 * const eur = await convertFromAED(100, "EUR", { decimals: 4 });
 * const manual = await convertFromAED(100, "USD", { rate: 0.2723 }); // 27.23
 * ```
 */
export async function convertFromAED(
	amount: number,
	currency: string,
	options: ConvertOptions = {},
): Promise<number> {
	assertFiniteAmount("convertFromAED", amount);
	const { decimals = 2 } = options;
	const rate = await resolveRate(currency.toUpperCase(), options.rate);
	return roundTo(amount * rate, decimals);
}

/**
 * Convert a foreign currency amount to AED.
 *
 * @example
 * ```ts
 * const aed = await convertToAED(27.23, "USD");
 * const manual = await convertToAED(27.23, "USD", { rate: 0.2723 }); // 100
 * ```
 */
export async function convertToAED(
	amount: number,
	currency: string,
	options: ConvertOptions = {},
): Promise<number> {
	assertFiniteAmount("convertToAED", amount);
	const { decimals = 2 } = options;
	const rate = await resolveRate(currency.toUpperCase(), options.rate);
	return roundTo(amount / rate, decimals);
}
