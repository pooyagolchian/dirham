import { BookOpen } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FACTS, LAST_VERIFIED, MAINTAINER } from "./content/facts";

/** Dated, sourced facts about the sign, placed right after the hero. */
export function KeyFacts() {
	return (
		<section id="facts" className="max-w-6xl mx-auto px-8 pt-20 pb-16">
			<SectionHeader
				icon={BookOpen}
				title="The UAE Dirham sign (U+20C3): key facts"
				description={
					<>
						Last verified:{" "}
						<time dateTime={LAST_VERIFIED.iso}>{LAST_VERIFIED.label}</time>,
						against Unicode and Central Bank of the UAE sources.
					</>
				}
				primary
			/>
			<dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{FACTS.map(({ term, text, sources }) => (
					<div
						key={term}
						className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
					>
						<dt className="text-[10px] text-neutral-400 uppercase tracking-widest mb-2">
							{term}
						</dt>
						<dd className="text-sm text-neutral-300 leading-relaxed">
							{text}
							{sources.length > 0 ? (
								<span className="block mt-2 text-xs text-neutral-400">
									{sources.length > 1 ? "Sources: " : "Source: "}
									{sources.map(({ label, href }, i) => (
										<span key={href}>
											{i > 0 ? " · " : null}
											<a
												href={href}
												target="_blank"
												rel="noreferrer noopener"
												className="text-emerald-400 hover:underline"
											>
												{label}
											</a>
										</span>
									))}
								</span>
							) : null}
						</dd>
					</div>
				))}
			</dl>
			<p className="mt-6 text-sm text-neutral-400 leading-relaxed">
				dirham is an independent open-source project and is not affiliated with
				the Central Bank of the UAE or the Unicode Consortium. Maintained by{" "}
				<a
					href={MAINTAINER.url}
					rel="author"
					className="text-neutral-300 hover:text-white underline underline-offset-2"
				>
					{MAINTAINER.name}
				</a>
				.
			</p>
		</section>
	);
}
