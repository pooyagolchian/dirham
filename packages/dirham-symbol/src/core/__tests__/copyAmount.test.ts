import { afterEach, describe, expect, it, vi } from "vitest";
import { copyDirhamAmount } from "../copyAmount";

describe("copyDirhamAmount", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("copies a formatted amount to the clipboard", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });

		await copyDirhamAmount(1234.5);
		expect(writeText).toHaveBeenCalledTimes(1);
		const written = writeText.mock.calls[0][0] as string;
		expect(written).toContain("1,234.50");
	});

	it("copies with AED code when useCode is true", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });

		await copyDirhamAmount(100, { useCode: true });
		const written = writeText.mock.calls[0][0] as string;
		expect(written).toContain("AED");
	});

	it("throws when clipboard is unavailable", async () => {
		vi.stubGlobal("navigator", {});
		await expect(copyDirhamAmount(100)).rejects.toThrow("Clipboard API");
	});

	it("throws when navigator is undefined", async () => {
		vi.stubGlobal("navigator", undefined);
		await expect(copyDirhamAmount(100)).rejects.toThrow();
	});
});
