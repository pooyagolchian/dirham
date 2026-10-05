import { DIRHAM_UNICODE } from "dirham";
import { Hash } from "lucide-react";
import { CodeText } from "./RichText";
import { QUICK_REFERENCE } from "./content/quick-reference";

/** Every way to write U+20C3 in one table; the glyph itself is drawn with the Dirham font. */
export function QuickReference() {
	return (
		<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
			<div className="flex items-center gap-2 mb-4">
				<Hash size={16} className="text-neutral-500" />
				<h3 id="quick-reference" className="text-sm font-medium text-white">
					Quick reference: UAE Dirham sign (U+20C3)
				</h3>
			</div>
			<table aria-labelledby="quick-reference" className="w-full text-sm">
				<tbody>
					<tr className="border-b border-neutral-800/60">
						<th
							scope="row"
							className="w-32 sm:w-44 py-2 pr-4 text-left align-top font-normal text-neutral-400"
						>
							Character
						</th>
						<td className="py-2">
							<span
								role="img"
								aria-label="UAE Dirham sign"
								className="text-2xl leading-none text-white"
								style={{ fontFamily: '"Dirham"' }}
							>
								{DIRHAM_UNICODE}
							</span>
						</td>
					</tr>
					{QUICK_REFERENCE.map(({ label, value }) => (
						<tr
							key={label}
							className="border-b border-neutral-800/60 last:border-b-0"
						>
							<th
								scope="row"
								className="w-32 sm:w-44 py-2 pr-4 text-left align-top font-normal text-neutral-400"
							>
								{label}
							</th>
							<td className="py-2 text-neutral-300 break-words">
								<CodeText text={value} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
