import React from 'react';
import { cn } from "../ui/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	footer?: React.ReactNode;
	bleed?: boolean; // remove default padding
}

export function Panel({
	title,
	description,
	footer,
	className,
	children,
	bleed = false,
	...rest
}: PanelProps) {
	return (
		<div
			className={cn(
				"rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm flex flex-col",
				className
			)}
			{...rest}
		>
			{(title || description) && (
				<div className={cn("px-5 pt-5", bleed && "px-0 pt-0")}>          
					{title && (
						<h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
					)}
					{description && (
						<p className="text-xs mt-1 text-white/60">{description}</p>
					)}
				</div>
			)}
			<div className={cn("px-5 py-4 flex-1", bleed && "p-0")}>{children}</div>
			{footer && (
				<div className="px-5 py-3 border-t border-white/10 bg-white/5 text-xs text-white/60">{footer}</div>
			)}
		</div>
	);
}

export function PanelGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
	);
}