import Image from "next/image";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLHeadingElement> {
	graphic?: boolean;
	className?: string;
}

const Logo = ({ graphic = false, className, ...props }: LogoProps) => {
	return (
		<h1
			className={`flex items-center gap-4 text-2xl font-semibold text-[#2b2b2b] tracking-[5px] ${className}`}
			{...props}
		>
			{graphic && <Image width={40} height={40} src="/songs-sphere.png" alt="Songs logotype" />}
			<span>SONGS</span>
		</h1>
	);
};

export default Logo;
