import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import API, { API_URL } from "../services/api";

const AnimatedBook = () => {
	const [logo, setLogo] = useState(null);
	const [siteName, setSiteName] = useState("EduClass");

	useEffect(() => {
		const fetchParams = async () => {
			try {
				const response = await API.getParameters();
				const params = response.data.data || [];

				const logoParam = params.find((p) => p.key === "logo");
				if (logoParam && logoParam.value) {
					setLogo(`${API_URL}/${logoParam.value}`);
				}

				const siteNameParam = params.find((p) => p.key === "site_name");
				if (siteNameParam && siteNameParam.value) {
					setSiteName(siteNameParam.value);
				}
			} catch (error) {
				console.error("Failed to fetch parameters:", error);
			}
		};
		fetchParams();
	}, []);

	// Page content templates
	const pageContents = [
		{ type: 'chapter', title: 'Introduction to Learning', number: '01' },
		{ type: 'text', lines: 8 },
		{ type: 'chapter', title: 'Core Concepts', number: '02' },
		{ type: 'text', lines: 10 },
		{ type: 'illustration', shape: 'circle' },
		{ type: 'text', lines: 7 },
		{ type: 'chapter', title: 'Advanced Topics', number: '03' },
		{ type: 'text', lines: 9 },
		{ type: 'illustration', shape: 'square' },
		{ type: 'text', lines: 6 },
	];

	return (
		<div className="book-container">
			<motion.div
				className="book"
				initial={{ rotateX: -15, rotateY: -25 }}
				animate={{
					rotateX: -15,
					rotateY: [-25, -20, -25, -30, -25],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				{/* Left Cover */}
				<div className="book-cover left-cover">
					<div className="cover-content">
						<div className="cover-badge">Premium Edition</div>
						<div className="title-section">
							{logo ? (
								<div className="logo-container">
									<img src={logo} alt={siteName} className="book-logo" />
								</div>
							) : (
								<h3 className="book-title">LEARN</h3>
							)}
							<div className="title-line"></div>
							<p className="book-subtitle">{siteName}</p>
							<p className="book-subtitle">Education Platform</p>
							<p className="book-edition">2025 Edition</p>
						</div>
						<div className="cover-decoration">
							<div className="deco-circle">
								<svg className="deco-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<div className="deco-line"></div>
						</div>
					</div>
				</div>

				{/* Pages Stack */}
				<div className="pages-stack">
					{[...Array(30)].map((_, i) => {
						const content = pageContents[i % pageContents.length];

						return (
							<div
								key={i}
								className="page"
								style={{
									transform: `translateZ(${i * 0.8}px)`,
									zIndex: 100 - i,
								}}
							>
								<div className="page-text">
									{content.type === 'chapter' ? (
										<>
											<div className="chapter-number">{content.number}</div>
											<div className="chapter-title">{content.title}</div>
											<div className="chapter-underline"></div>
										</>
									) : content.type === 'illustration' ? (
										<div className="illustration-container">
											{content.shape === 'circle' ? (
												<div className="illustration-circle">
													<div className="illus-detail"></div>
													<div className="illus-detail"></div>
													<div className="illus-detail"></div>
												</div>
											) : (
												<div className="illustration-square">
													<div className="illus-bar"></div>
													<div className="illus-bar"></div>
													<div className="illus-bar"></div>
												</div>
											)}
										</div>
									) : (
										<>
											{[...Array(content.lines)].map((_, lineIdx) => (
												<div
													key={lineIdx}
													className={`text-line ${lineIdx === content.lines - 1 ? 'short' : ''} ${lineIdx % 3 === 0 ? 'bold' : ''}`}
												></div>
											))}
										</>
									)}
									<div className="page-number">{i + 1}</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Right Cover (Back) */}
				<div className="book-cover right-cover">
					<div className="cover-back">
						<div className="back-text">
							<div className="barcode">
								<div className="bar"></div>
								<div className="bar"></div>
								<div className="bar"></div>
								<div className="bar"></div>
								<div className="bar"></div>
							</div>
							<p className="isbn">ISBN 978-0-12345-678-9</p>
						</div>
					</div>
				</div>

				{/* Spine */}
				<div className="book-spine">
					<div className="spine-text">EDUCATION PLATFORM • 2025</div>
				</div>
			</motion.div>

			<style jsx>{`
				.book-container {
					width: 480px;
					height: 560px;
					display: flex;
					align-items: center;
					justify-content: center;
					perspective: 3000px;
					perspective-origin: 50% 50%;
					margin: 0 auto;
				}

				.book {
					width: 300px;
					height: 400px;
					position: relative;
					transform-style: preserve-3d;
					filter: drop-shadow(0 40px 80px rgba(119, 118, 188, 0.6))
						drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))
						drop-shadow(-15px 25px 50px rgba(255, 118, 77, 0.3));
				}

				.book-cover {
					position: absolute;
					width: 300px;
					height: 400px;
					transform-style: preserve-3d;
					backface-visibility: hidden;
				}

				.left-cover {
					transform-origin: left center;
					z-index: 200;
				}

				.cover-content {
					width: 100%;
					height: 100%;
					background: linear-gradient(135deg, #7776bc 0%, #9b5de5 50%, #ff764d 100%);
					border-radius: 6px 10px 10px 6px;
					padding: 45px 35px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					position: relative;
					overflow: hidden;
					box-shadow:
						inset -8px 0 20px rgba(0, 0, 0, 0.3),
						inset 5px 0 15px rgba(255, 255, 255, 0.15),
						0 5px 25px rgba(0, 0, 0, 0.2);
				}

				.cover-badge {
					position: absolute;
					top: 20px;
					right: 20px;
					background: rgba(255, 253, 189, 0.3);
					color: white;
					padding: 6px 12px;
					border-radius: 20px;
					font-size: 10px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 1px;
					border: 1px solid rgba(255, 253, 189, 0.5);
					z-index: 3;
				}

				.cover-content::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background:
						linear-gradient(45deg, rgba(255, 253, 189, 0.15) 0%, transparent 50%),
						radial-gradient(circle at 30% 30%, rgba(221, 236, 81, 0.2) 0%, transparent 60%);
				}

				.title-section {
					position: relative;
					z-index: 2;
				}

				.logo-container {
					margin-bottom: 15px;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 10px;
					background: rgba(255, 255, 255, 0.15);
					border-radius: 12px;
					backdrop-filter: blur(10px);
				}

				.book-logo {
					max-width: 120px;
					max-height: 80px;
					width: auto;
					height: auto;
					object-fit: contain;
					filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
				}

				.book-title {
					font-size: 48px;
					font-weight: 900;
					color: white;
					text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
					letter-spacing: 4px;
					margin-bottom: 15px;
				}

				.title-line {
					width: 100px;
					height: 4px;
					background: linear-gradient(to right, #ddec51, #fffdbd);
					border-radius: 2px;
					margin-bottom: 20px;
					box-shadow: 0 2px 8px rgba(221, 236, 81, 0.5);
				}

				.book-subtitle {
					font-size: 18px;
					font-weight: 600;
					color: rgba(255, 255, 255, 0.95);
					text-transform: uppercase;
					letter-spacing: 3px;
					margin: 5px 0;
					text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
				}

				.book-edition {
					font-size: 14px;
					font-weight: 500;
					color: rgba(255, 253, 189, 0.9);
					margin-top: 10px;
					letter-spacing: 2px;
				}

				.cover-decoration {
					position: relative;
					z-index: 2;
					display: flex;
					align-items: center;
					gap: 15px;
				}

				.deco-circle {
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border: 3px solid rgba(255, 253, 189, 0.6);
					background: rgba(221, 236, 81, 0.2);
					box-shadow: 0 0 20px rgba(221, 236, 81, 0.4);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.deco-icon {
					width: 32px;
					height: 32px;
					color: rgba(255, 253, 189, 0.9);
				}

				.deco-line {
					flex: 1;
					height: 2px;
					background: linear-gradient(to right, rgba(255, 253, 189, 0.6), transparent);
				}

				.pages-stack {
					position: absolute;
					left: 4px;
					top: 0;
					width: 292px;
					height: 400px;
					transform-style: preserve-3d;
					z-index: 100;
				}

				.page {
					position: absolute;
					width: 100%;
					height: 100%;
					background: linear-gradient(to right, #fffef5 0%, #fffdbd 50%, #fffef5 100%);
					border: 1px solid #e8e0c0;
					border-right: 3px solid #d4cca8;
					box-shadow:
						3px 0 5px rgba(0, 0, 0, 0.15),
						inset -3px 0 8px rgba(0, 0, 0, 0.08),
						inset 0 0 0 1px rgba(255, 253, 189, 0.3);
					transform-origin: left center;
				}

				.page::after {
					content: '';
					position: absolute;
					right: 0;
					top: 0;
					bottom: 0;
					width: 3px;
					background: linear-gradient(to bottom,
						rgba(212, 204, 168, 0.3) 0%,
						rgba(212, 204, 168, 0.8) 50%,
						rgba(212, 204, 168, 0.3) 100%);
					pointer-events: none;
				}

				.page-text {
					padding: 50px 40px;
					position: relative;
					height: 100%;
				}

				.text-line {
					height: 3px;
					background: rgba(119, 118, 188, 0.15);
					margin: 20px 0;
					border-radius: 2px;
				}

				.text-line.short {
					width: 60%;
				}

				.text-line.bold {
					height: 4px;
					background: rgba(119, 118, 188, 0.25);
				}

				.chapter-number {
					font-size: 48px;
					font-weight: 900;
					color: rgba(119, 118, 188, 0.2);
					letter-spacing: 2px;
					margin-bottom: 10px;
				}

				.chapter-title {
					font-size: 22px;
					font-weight: 700;
					color: rgba(119, 118, 188, 0.8);
					margin-bottom: 15px;
					letter-spacing: 1px;
				}

				.chapter-underline {
					width: 80px;
					height: 4px;
					background: linear-gradient(to right, rgba(119, 118, 188, 0.6), rgba(255, 118, 77, 0.4));
					border-radius: 2px;
					margin-top: 10px;
				}

				.illustration-container {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 40px 0;
				}

				.illustration-circle {
					width: 120px;
					height: 120px;
					border-radius: 50%;
					border: 3px solid rgba(119, 118, 188, 0.3);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 8px;
					position: relative;
				}

				.illus-detail {
					width: 40px;
					height: 4px;
					background: rgba(255, 118, 77, 0.4);
					border-radius: 2px;
				}

				.illustration-square {
					width: 140px;
					height: 100px;
					border: 3px solid rgba(119, 118, 188, 0.3);
					border-radius: 8px;
					display: flex;
					align-items: flex-end;
					justify-content: space-around;
					padding: 15px;
					gap: 10px;
				}

				.illus-bar {
					flex: 1;
					background: linear-gradient(to top, rgba(119, 118, 188, 0.4), rgba(255, 118, 77, 0.3));
					border-radius: 4px;
				}

				.illus-bar:nth-child(1) {
					height: 40%;
				}

				.illus-bar:nth-child(2) {
					height: 70%;
				}

				.illus-bar:nth-child(3) {
					height: 55%;
				}

				.page-number {
					position: absolute;
					bottom: 30px;
					right: 40px;
					font-size: 12px;
					font-weight: 600;
					color: rgba(119, 118, 188, 0.4);
				}

				.right-cover {
					transform: translateZ(-24px);
					z-index: 50;
				}

				.cover-back {
					width: 100%;
					height: 100%;
					background: linear-gradient(135deg, #ff764d 0%, #ddec51 100%);
					border-radius: 10px 6px 6px 10px;
					box-shadow:
						inset 8px 0 20px rgba(0, 0, 0, 0.3),
						inset -8px 0 15px rgba(255, 255, 255, 0.15),
						0 5px 25px rgba(0, 0, 0, 0.2);
					display: flex;
					align-items: flex-end;
					justify-content: center;
					padding: 40px;
				}

				.back-text {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 10px;
				}

				.barcode {
					display: flex;
					gap: 4px;
					align-items: flex-end;
					height: 60px;
					padding: 8px 12px;
					background: white;
					border-radius: 4px;
				}

				.bar {
					width: 3px;
					background: #000;
					border-radius: 1px;
				}

				.bar:nth-child(1) {
					height: 45px;
				}

				.bar:nth-child(2) {
					height: 50px;
				}

				.bar:nth-child(3) {
					height: 40px;
				}

				.bar:nth-child(4) {
					height: 48px;
				}

				.bar:nth-child(5) {
					height: 42px;
				}

				.isbn {
					font-size: 11px;
					font-weight: 600;
					color: rgba(255, 255, 255, 0.9);
					letter-spacing: 1px;
					text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
				}

				.book-spine {
					position: absolute;
					left: 0;
					top: 0;
					width: 75px;
					height: 400px;
					background: linear-gradient(to bottom, #5a59a0 0%, #7776bc 50%, #9b5de5 100%);
					transform: translateX(-75px) rotateY(90deg);
					transform-origin: right center;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow:
						inset 0 25px 40px rgba(0, 0, 0, 0.3),
						inset 0 -25px 40px rgba(0, 0, 0, 0.3),
						inset 10px 0 20px rgba(0, 0, 0, 0.2),
						inset -10px 0 20px rgba(255, 255, 255, 0.1);
					z-index: 150;
				}

				.spine-text {
					writing-mode: vertical-rl;
					text-orientation: mixed;
					color: white;
					font-weight: 800;
					font-size: 18px;
					letter-spacing: 4px;
					text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
				}

				@media (max-width: 768px) {
					.book-container {
						width: 360px;
						height: 460px;
						perspective: 2200px;
					}
					.book {
						width: 240px;
						height: 320px;
					}
					.book-cover,
					.pages-stack,
					.book-spine {
						height: 320px;
					}
					.book-cover {
						width: 240px;
					}
					.pages-stack {
						width: 234px;
					}
					.book-spine {
						width: 60px;
						transform: translateX(-60px) rotateY(90deg);
					}
					.book-logo {
						max-width: 90px;
						max-height: 60px;
					}
					.book-title {
						font-size: 36px;
					}
					.book-subtitle {
						font-size: 14px;
					}
					.book-edition {
						font-size: 12px;
					}
					.spine-text {
						font-size: 14px;
					}
					.chapter-number {
						font-size: 36px;
					}
					.chapter-title {
						font-size: 18px;
					}
					.page-text {
						padding: 40px 30px;
					}
					.illustration-circle {
						width: 90px;
						height: 90px;
					}
					.illustration-square {
						width: 110px;
						height: 80px;
					}
					.deco-icon {
						width: 24px;
						height: 24px;
					}
				}
			`}</style>
		</div>
	);
};

export default AnimatedBook;
