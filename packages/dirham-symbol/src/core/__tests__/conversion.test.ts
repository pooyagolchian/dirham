import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearRateCache,
	convertFromAED,
	convertToAED,
	fetchExchangeRates,
} from "../conversion";

const MOCK_RATES = {
	AED: 1,
	USD: 0.2723,
	EUR: 0.2511,
	GBP: 0.2158,
};

describe("fetchExchangeRates", () => {
	beforeEach(() => {
		clearRateCache();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches rates from API", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ rates: MOCK_RATES }),
		});
		vi.stubGlobal("fetch", fetchMock);

		const rates = await fetchExchangeRates();
		expect(rates).toEqual(MOCK_RATES);
		expect(fetchMock).toHaveBeenCalledTimes(1);

		vi.unstubAllGlobals();
	});

	it("returns cached rates on second call", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ rates: MOCK_RATES }),
		});
		vi.stubGlobal("fetch", fetchMock);

		await fetchExchangeRates();
		await fetchExchangeRates();
		expect(fetchMock).toHaveBeenCalledTimes(1);

		vi.unstubAllGlobals();
	});

	it("throws on non-ok response", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
		});
		vi.stubGlobal("fetch", fetchMock);

		await expect(fetchExchangeRates()).rejects.toThrow("Failed to fetch");

		vi.unstubAllGlobals();
	});

	it("throws on missing rates in response", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({}),
		});
		vi.stubGlobal("fetch", fetchMock);

		await expect(fetchExchangeRates()).rejects.toThrow("missing rates");

		vi.unstubAllGlobals();
	});
});

describe("convertFromAED", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		clearRateCache();
	});

	it("converts using a custom rate", async () => {
		const result = await convertFromAED(100, "USD", { rate: 0.2723 });
		expect(result).toBe(27.23);
	});

	it("respects custom decimals", async () => {
		const result = await convertFromAED(100, "USD", {
			rate: 0.27234,
			decimals: 4,
		});
		expect(result).toBe(27.234);
	});

	it("fetches rates when no custom rate provided", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ rates: MOCK_RATES }),
		});
		vi.stubGlobal("fetch", fetchMock);

		const result = await convertFromAED(100, "USD");
		expect(result).toBe(27.23);
	});

	it("throws on NaN amount", async () => {
		await expect(convertFromAED(Number.NaN, "USD")).rejects.toThrow(
			RangeError,
		);
	});

	it("throws on unknown currency code", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ rates: MOCK_RATES }),
		});
		vi.stubGlobal("fetch", fetchMock);

		await expect(convertFromAED(100, "XYZ")).rejects.toThrow(
			"Unknown currency",
		);
	});

	it("handles case-insensitive currency codes", async () => {
		const result = await convertFromAED(100, "usd", { rate: 0.2723 });
		expect(result).toBe(27.23);
	});
});

describe("convertToAED", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		clearRateCache();
	});

	it("converts using a custom rate", async () => {
		const result = await convertToAED(27.23, "USD", { rate: 0.2723 });
		expect(result).toBe(100);
	});

	it("throws on NaN amount", async () => {
		await expect(convertToAED(Number.NaN, "USD")).rejects.toThrow(RangeError);
	});

	it("throws when exchange rate is zero", async () => {
		await expect(
			convertToAED(100, "XYZ", { rate: 0 }),
		).rejects.toThrow("zero");
	});
});

describe("clearRateCache", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("forces re-fetch after clearing", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ rates: MOCK_RATES }),
		});
		vi.stubGlobal("fetch", fetchMock);

		await fetchExchangeRates();
		clearRateCache();
		await fetchExchangeRates();
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
