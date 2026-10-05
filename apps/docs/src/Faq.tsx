import { CircleHelp } from "lucide-react";
import { ArabicText } from "./RichText";
import { SectionHeader } from "./SectionHeader";
import { LAST_VERIFIED } from "./content/facts";
import faq from "./content/faq.json";

/**
 * The visible FAQ. vite.config.ts publishes the same file as FAQPage JSON-LD, so each
 * question and answer here is exactly the text of the structured data. The optional
 * detail line appears on the page only. Answers stay fully visible (no accordion), and
 * each question's id is a stable link target, e.g. #dirham-sign-in-excel-and-word.
 */
export function Faq() {
	return (
		<section id="faq" className="max-w-6xl mx-auto px-8 pt-24 pb-20">
			<SectionHeader
				icon={CircleHelp}
				title="UAE Dirham sign: questions and answers"
				description={
					<>
						Each answer starts with the short version. Last verified:{" "}
						<time dateTime={LAST_VERIFIED.iso}>{LAST_VERIFIED.label}</time>.
					</>
				}
				primary
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
				{faq.map((entry) => (
					// min-w-0 and break-words let long URLs and escapes wrap on phones.
					<div key={entry.id} className="min-w-0 break-words">
						<h3
							id={entry.id}
							className="text-base font-semibold text-white mb-2"
						>
							<ArabicText text={entry.question} />
						</h3>
						<p className="text-sm text-neutral-300 leading-relaxed">
							<ArabicText text={entry.answer} />
						</p>
						{entry.detail ? (
							<p className="text-sm text-neutral-400 leading-relaxed mt-2">
								<ArabicText text={entry.detail} />
							</p>
						) : null}
					</div>
				))}
			</div>
		</section>
	);
}
