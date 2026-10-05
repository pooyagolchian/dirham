import clsx from "clsx";
import type React from "react";

/** Icon, h2 and one-paragraph description at the top of each page section. */
export function SectionHeader({
	icon: Icon,
	title,
	description,
	primary = false,
}: {
	icon: React.ElementType;
	title: string;
	description: React.ReactNode;
	primary?: boolean;
}) {
	return (
		<div className="mb-12">
			<div className="flex items-center gap-3 mb-3">
				<div
					className={clsx(
						"flex items-center justify-center rounded-xl border border-neutral-800",
						primary ? "w-10 h-10 bg-emerald-500/10" : "w-9 h-9 bg-white/[0.04]",
					)}
				>
					<Icon
						size={primary ? 18 : 17}
						className={primary ? "text-emerald-400" : "text-neutral-400"}
					/>
				</div>
				<h2
					className={clsx(
						"font-semibold tracking-tight text-white",
						primary ? "text-3xl" : "text-2xl",
					)}
				>
					{title}
				</h2>
			</div>
			<p className="text-neutral-400 leading-relaxed ml-12">{description}</p>
		</div>
	);
}
