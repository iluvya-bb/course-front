import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const Hero3DAnimation = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 150 };
	const x = useSpring(mouseX, springConfig);
	const y = useSpring(mouseY, springConfig);

	useEffect(() => {
		const handleMouseMove = (e) => {
			const { clientX, clientY } = e;
			const { innerWidth, innerHeight } = window;
			const xPct = (clientX / innerWidth - 0.5) * 2;
			const yPct = (clientY / innerHeight - 0.5) * 2;
			setMousePosition({ x: xPct, y: yPct });
			mouseX.set(xPct * 50);
			mouseY.set(yPct * 50);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	// Particle data
	const particles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		size: Math.random() * 4 + 2,
		duration: Math.random() * 10 + 15,
		delay: Math.random() * 5,
		initialX: Math.random() * 100,
		initialY: Math.random() * 100,
	}));

	return (
		<div className="relative w-full h-full flex items-center justify-center overflow-hidden">
			{/* Animated Gradient Background */}
			<motion.div
				className="absolute inset-0 opacity-30"
				style={{
					background: "radial-gradient(circle at 50% 50%, #7776bc 0%, #ff764d 50%, #ddec51 100%)",
				}}
				animate={{
					background: [
						"radial-gradient(circle at 20% 30%, #7776bc 0%, #ff764d 50%, #ddec51 100%)",
						"radial-gradient(circle at 80% 70%, #ff764d 0%, #ddec51 50%, #7776bc 100%)",
						"radial-gradient(circle at 20% 30%, #7776bc 0%, #ff764d 50%, #ddec51 100%)",
					],
				}}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			/>

			{/* Particles */}
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute rounded-full bg-white/20 backdrop-blur-sm"
					style={{
						width: particle.size,
						height: particle.size,
						left: `${particle.initialX}%`,
						top: `${particle.initialY}%`,
						x,
						y,
					}}
					animate={{
						y: [0, -100, 0],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: particle.duration,
						delay: particle.delay,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}

			{/* Main 3D Scene */}
			<div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1000px" }}>
				{/* Center Floating Sphere */}
				<motion.div
					className="absolute w-64 h-64 rounded-full"
					style={{
						background: "linear-gradient(135deg, rgba(119, 118, 188, 0.3), rgba(255, 118, 77, 0.3))",
						backdropFilter: "blur(40px)",
						boxShadow: "0 20px 60px rgba(119, 118, 188, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)",
						rotateX: useTransform(y, [-50, 50], [15, -15]),
						rotateY: useTransform(x, [-50, 50], [-15, 15]),
			}}
					animate={{
						scale: [1, 1.1, 1],
						rotate: [0, 360],
					}}
					transition={{
						scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
						rotate: { duration: 20, repeat: Infinity, ease: "linear" },
					}}
				>
					{/* Inner glow */}
					<motion.div
						className="absolute inset-4 rounded-full"
						style={{
							background: "radial-gradient(circle at 30% 30%, rgba(255, 253, 189, 0.6), transparent)",
						}}
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.5, 0.8, 0.5],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</motion.div>

				{/* Floating Ring 1 */}
				<motion.div
					className="absolute w-96 h-96 rounded-full border-4 border-brand-lavender/30"
					style={{
						rotateX: useTransform(y, [-50, 50], [20, -20]),
						rotateY: useTransform(x, [-50, 50], [-20, 20]),
						rotateZ: 45,
					}}
					animate={{
						rotateZ: [45, 405],
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "linear",
					}}
				/>

				{/* Floating Ring 2 */}
				<motion.div
					className="absolute w-80 h-80 rounded-full border-4 border-brand-coral/30"
					style={{
						rotateX: useTransform(y, [-50, 50], [-20, 20]),
						rotateY: useTransform(x, [-50, 50], [20, -20]),
						rotateZ: -45,
					}}
					animate={{
						rotateZ: [-45, -405],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "linear",
					}}
				/>

				{/* Geometric Shapes */}
				{/* Cube */}
				<motion.div
					className="absolute w-24 h-24"
					style={{
						background: "linear-gradient(135deg, rgba(221, 236, 81, 0.4), rgba(255, 118, 77, 0.4))",
						backdropFilter: "blur(20px)",
						borderRadius: "12px",
						boxShadow: "0 10px 30px rgba(221, 236, 81, 0.3)",
						x: useTransform(x, [-50, 50], [-100, 100]),
						y: useTransform(y, [-50, 50], [-80, 80]),
						rotateX: useTransform(y, [-50, 50], [30, -30]),
						rotateY: useTransform(x, [-50, 50], [-30, 30]),
					}}
					animate={{
						rotate: [0, 360],
						y: [0, -20, 0],
					}}
					transition={{
						rotate: { duration: 20, repeat: Infinity, ease: "linear" },
						y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
					}}
				>
					<div className="absolute inset-2 bg-gradient-to-br from-brand-yellow/50 to-transparent rounded-lg" />
				</motion.div>

				{/* Hexagon */}
				<motion.div
					className="absolute w-20 h-20"
					style={{
						clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
						background: "linear-gradient(135deg, rgba(119, 118, 188, 0.4), rgba(221, 236, 81, 0.4))",
						backdropFilter: "blur(20px)",
						boxShadow: "0 10px 30px rgba(119, 118, 188, 0.3)",
						x: useTransform(x, [-50, 50], [120, -120]),
						y: useTransform(y, [-50, 50], [100, -100]),
						rotateX: useTransform(y, [-50, 50], [-30, 30]),
						rotateZ: useTransform(x, [-50, 50], [30, -30]),
					}}
					animate={{
						rotate: [0, -360],
						scale: [1, 1.2, 1],
					}}
					transition={{
						rotate: { duration: 25, repeat: Infinity, ease: "linear" },
						scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
					}}
				/>

				{/* Triangle */}
				<motion.div
					className="absolute w-16 h-16"
					style={{
						clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
						background: "linear-gradient(135deg, rgba(255, 118, 77, 0.4), rgba(255, 253, 189, 0.4))",
						backdropFilter: "blur(20px)",
						boxShadow: "0 10px 30px rgba(255, 118, 77, 0.3)",
						x: useTransform(x, [-50, 50], [-80, 80]),
						y: useTransform(y, [-50, 50], [120, -120]),
						rotateY: useTransform(x, [-50, 50], [30, -30]),
					}}
					animate={{
						rotate: [0, 360],
						y: [0, 15, 0],
					}}
					transition={{
						rotate: { duration: 18, repeat: Infinity, ease: "linear" },
						y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
					}}
				/>

				{/* Small Spheres */}
				{[...Array(5)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-12 h-12 rounded-full"
						style={{
							background: `linear-gradient(135deg, rgba(${119 + i * 20}, ${118 + i * 10}, ${188 - i * 15}, 0.3), rgba(${255 - i * 20}, ${118 + i * 30}, ${77 + i * 40}, 0.3))`,
							backdropFilter: "blur(15px)",
							boxShadow: "0 8px 20px rgba(119, 118, 188, 0.2)",
							x: useTransform(x, [-50, 50], [-60 + i * 30, 60 - i * 30]),
							y: useTransform(y, [-50, 50], [-80 + i * 40, 80 - i * 40]),
						}}
						animate={{
							x: [0, (i % 2 === 0 ? 20 : -20), 0],
							y: [0, (i % 2 === 0 ? -20 : 20), 0],
							scale: [1, 1.3, 1],
						}}
						transition={{
							duration: 6 + i,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.5,
						}}
					>
						<motion.div
							className="absolute inset-1 rounded-full bg-white/20"
							animate={{
								scale: [1, 1.5, 1],
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</motion.div>
				))}

				{/* Wireframe Grid */}
				<motion.div
					className="absolute w-full h-full"
					style={{
						backgroundImage: `
							linear-gradient(to right, rgba(119, 118, 188, 0.1) 1px, transparent 1px),
							linear-gradient(to bottom, rgba(119, 118, 188, 0.1) 1px, transparent 1px)
						`,
						backgroundSize: "40px 40px",
						opacity: 0.3,
						rotateX: useTransform(y, [-50, 50], [10, -10]),
						rotateY: useTransform(x, [-50, 50], [-10, 10]),
					}}
				/>

				{/* Glowing Orbs */}
				<motion.div
					className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
					style={{
						background: "radial-gradient(circle, rgba(221, 236, 81, 0.4) 0%, transparent 70%)",
						filter: "blur(30px)",
					}}
					animate={{
						x: [0, 50, 0],
						y: [0, -30, 0],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<motion.div
					className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full"
					style={{
						background: "radial-gradient(circle, rgba(255, 118, 77, 0.4) 0%, transparent 70%)",
						filter: "blur(30px)",
					}}
					animate={{
						x: [0, -50, 0],
						y: [0, 30, 0],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
			</div>

			{/* Subtle overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-100/50 pointer-events-none" />
		</div>
	);
};

export default Hero3DAnimation;
