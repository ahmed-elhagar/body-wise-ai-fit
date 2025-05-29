
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced Health & Fitness Color System
				health: {
					primary: '#2563eb',     // Vibrant Blue - Trust & Reliability
					secondary: '#16a34a',   // Fresh Green - Health & Growth
					accent: '#dc2626',      // Energy Red - Action & Motivation
					warning: '#f59e0b',     // Amber - Caution & Energy
					success: '#10b981',     // Emerald - Achievement & Success
					info: '#3b82f6',        // Sky Blue - Information & Calm
					soft: '#f8fafc',        // Very Light Gray - Background
					'soft-blue': '#eff6ff', // Light Blue Background
					'soft-green': '#f0fdf4', // Light Green Background
					'soft-red': '#fef2f2',  // Light Red Background
					border: '#e2e8f0',      // Soft Border Gray
					'border-light': '#f1f5f9', // Lighter Border
					'text-primary': '#1e293b',   // Dark Slate for Primary Text
					'text-secondary': '#64748b', // Slate for Secondary Text
					'text-muted': '#94a3b8',     // Light Slate for Muted Text
				},
				fitness: {
					primary: '#2563eb',
					secondary: '#16a34a',
					accent: '#dc2626',
					success: '#10b981',
					warning: '#f59e0b',
					danger: '#dc2626',
					'soft-blue': '#eff6ff',
					'soft-green': '#f0fdf4',
					'soft-gray': '#f8fafc',
					'neutral-50': '#fafafa',
					'neutral-100': '#f5f5f5',
					'neutral-200': '#e5e5e5',
					'neutral-300': '#d4d4d4',
					'neutral-400': '#a3a3a3',
					'neutral-500': '#737373',
					'neutral-600': '#525252',
					'neutral-700': '#404040',
					'neutral-800': '#262626',
					'neutral-900': '#171717'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(4px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-2px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'health-gradient': 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
				'success-gradient': 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
				'energy-gradient': 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
				'calm-gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
				'neutral-gradient': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			fontSize: {
				'2xs': '0.625rem',
			},
			boxShadow: {
				'health': '0 4px 14px 0 rgba(37, 99, 235, 0.15)',
				'success': '0 4px 14px 0 rgba(16, 185, 129, 0.15)',
				'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
				'elevated': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
