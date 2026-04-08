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
	 * @default 2
	 */
	decimals?: number;

	/**
	 * Custom exchange rate (AED per 1 unit of target currency).
	 * When provided, skips network fetch.
	 */
	rate?: number;
}

/**
 * Fetch exchange rates from the Central Bank of UAE open API.
 * Results are cached in memory for 1 hour.
 *
 * Uses the free, no-auth-required exchangerate.host API as a fallback-safe source.
 *
 * @returns Map of currency codes to their AED exchange rates.
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
	if (_cache && Date.now() - _cache.timestamp < CACHE_TTL) {
		return _cache.rates;
	}

	const res = await fetch(
		"https://open.er-api.com/v6/latest/AED",
	);

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
 * Convert an AED amount to another currency.
 *
 * @example
 * ```ts
 * const usd = await convertFromAED(100, "USD");
 * const eur = await convertFromAED(100, "EUR", { decimals: 4 });
 * const manual = await convertFromAED(100, "USD", { rate: 0.2723 });
 * ```
 */
export async function convertFromAED(
	amount: number,
	currency: string,
	options: ConvertOptions = {},
): Promise<number> {
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`convertFromAED: amount must be a finite number, got ${amount}`,
		);
	}
	const { decimals = 2 } = options;
	const code = currency.toUpperCase();

	let rate: number;
	if (options.rate !== undefined) {
		rate = options.rate;
	} else {
		const rates = await fetchExchangeRates();
		const r = rates[code];
		if (r === undefined) {
			throw new Error(`Unknown currency code: ${code}`);
		}
		rate = r;
	}

	const factor = 10 ** decimals;
	return Math.round(amount * rate * factor) / factor;
}

/**
 * Convert a foreign currency amount to AED.
 *
 * @example
 * ```ts
 * const aed = await convertToAED(27.23, "USD");
 * ```
 */
export async function convertToAED(
	amount: number,
	currency: string,
	options: ConvertOptions = {},
): Promise<number> {
	if (!Number.isFinite(amount)) {
		throw new RangeError(
			`convertToAED: amount must be a finite number, got ${amount}`,
		);
	}
	const { decimals = 2 } = options;
	const code = currency.toUpperCase();

	let rate: number;
	if (options.rate !== undefined) {
		rate = options.rate;
	} else {
		const rates = await fetchExchangeRates();
		const r = rates[code];
		if (r === undefined) {
			throw new Error(`Unknown currency code: ${code}`);
		}
		rate = r;
	}

	if (rate === 0) {
		throw new Error(`Exchange rate for ${code} is zero`);
	}

	const factor = 10 ** decimals;
	return Math.round((amount / rate) * factor) / factor;
}
