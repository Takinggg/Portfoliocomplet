import React from 'react';
import { motion } from 'motion/react';
import { cn } from "../ui/utils";
import { colors } from '../../styles/designSystem';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	footer?: React.ReactNode;
	bleed?: boolean;
	variant?: 'default' | 'elevated' | 'accent' | 'ghost';
	headerAction?: React.ReactNode;
	animate?: boolean;
	icon?: React.ReactNode;
}

export function Panel({
	title,
	description,
	footer,
	className,
	children,
	bleed = false,
	variant = 'default',
	headerAction,
	animate = true,
	icon,
	...rest
}: PanelProps) {
	const variantStyles = {
		default: "border-white/10 bg-white/5 backdrop-blur-sm",
		elevated: "border-white/15 bg-white/8 backdrop-blur-md shadow-lg",
		accent: "border-[#00FFC2]/20 bg-[#00FFC2]/5 backdrop-blur-sm",
		ghost: "border-white/5 bg-transparent backdrop-blur-sm"
	};

	const content = (
		<>
			{(title || description || headerAction) && (
				<div className={cn(
					"px-6 pt-6 pb-4",
					bleed && "px-0 pt-0"
				)}>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							{title && (
								<div className="flex items-center gap-3 mb-1">
									{icon && (
										<div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center text-[#00FFC2]">
											{icon}
										</div>
									)}
									<h3 className="text-lg font-semibold tracking-tight text-white">
										{title}
									</h3>
								</div>
							)}
							{description && (
								<p className="text-sm text-white/60 leading-relaxed">
									{description}
								</p>
							)}
						</div>
						{headerAction && (
							<div className="flex-shrink-0">
								{headerAction}
							</div>
						)}
					</div>
				</div>
			)}
			<div className={cn(
				"px-6 py-5 flex-1",
				bleed && "p-0",
				!title && !description && "pt-6"
			)}>
				{children}
			</div>
			{footer && (
				<div className="px-6 py-4 border-t border-white/10 bg-white/5 text-sm text-white/60">
					{footer}
				</div>
			)}
		</>
	);

	if (animate) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
				className={cn(
					"rounded-xl border flex flex-col overflow-hidden transition-all duration-300",
					"hover:border-white/20 hover:shadow-xl",
					variantStyles[variant],
					className
				)}
			>
				{content}
			</motion.div>
		);
	}

	return (
		<div
			className={cn(
				"rounded-xl border flex flex-col overflow-hidden transition-all duration-300",
				"hover:border-white/20 hover:shadow-xl",
				variantStyles[variant],
				className
			)}
			{...rest}
		>
			{content}
		</div>
	);
}

export function PanelGrid({ 
	children, 
	cols = 3 
}: { 
	children: React.ReactNode;
	cols?: 1 | 2 | 3 | 4;
}) {
	const colsClass = {
		1: "md:grid-cols-1",
		2: "md:grid-cols-2",
		3: "md:grid-cols-2 xl:grid-cols-3",
		4: "md:grid-cols-2 xl:grid-cols-4"
	};

	return (
		<div className={cn("grid gap-6", colsClass[cols])}>
			{children}
		</div>
	);
}