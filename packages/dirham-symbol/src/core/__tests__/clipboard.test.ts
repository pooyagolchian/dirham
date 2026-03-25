import { describe, expect, it, vi } from "vitest";
import { copyDirhamSymbol } from "../clipboard";

describe("copyDirhamSymbol", () => {
	it("calls navigator.clipboard.writeText with unicode symbol by default", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(globalThis, {
			navigator: { clipboard: { writeText } },
		});

		await copyDirhamSymbol();
		expect(writeText).toHaveBeenCalledWith("\u20C3");
	});

	it("copies HTML entity when format is 'html'", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(globalThis, {
			navigator: { clipboard: { writeText } },
		});

		await copyDirhamSymbol("html");
		expect(writeText).toHaveBeenCalledWith("&#x20C3;");
	});

	it("copies CSS content when format is 'css'", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(globalThis, {
			navigator: { clipboard: { writeText } },
		});

		await copyDirhamSymbol("css");
		expect(writeText).toHaveBeenCalledWith("\\20C3");
	});

	it("copies Arabic text when format is 'arabic'", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(globalThis, {
			navigator: { clipboard: { writeText } },
		});

		await copyDirhamSymbol("arabic");
		expect(writeText).toHaveBeenCalledWith("د.إ");
	});

	it("throws when clipboard API is not available", async () => {
		Object.assign(globalThis, { navigator: {} });

		await expect(copyDirhamSymbol()).rejects.toThrow("Clipboard API");
	});
});
