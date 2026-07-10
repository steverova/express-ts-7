export interface Product {
	id: number
	name: string
	price: number
	category: string
	description: string
	stock: number
	rating: number
}

export const products: Product[] = [
	{
		id: 1,
		name: 'Laptop Pro 15',
		price: 1299,
		category: 'electronics',
		description: 'High-performance laptop with 15-inch display',
		stock: 12,
		rating: 4.7
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		price: 79,
		category: 'electronics',
		description: 'Noise-cancelling over-ear headphones',
		stock: 45,
		rating: 4.3
	},
	{
		id: 3,
		name: 'Mechanical Keyboard',
		price: 129,
		category: 'electronics',
		description: 'Compact TKL keyboard with RGB backlight',
		stock: 30,
		rating: 4.6
	},
	{
		id: 4,
		name: 'Coffee Mug',
		price: 14,
		category: 'kitchen',
		description: 'Ceramic mug with 350ml capacity',
		stock: 200,
		rating: 4.1
	},
	{
		id: 5,
		name: 'French Press',
		price: 34,
		category: 'kitchen',
		description: 'Stainless steel 600ml french press',
		stock: 60,
		rating: 4.4
	},
	{
		id: 6,
		name: 'Desk Lamp',
		price: 45,
		category: 'office',
		description: 'LED desk lamp with adjustable brightness',
		stock: 75,
		rating: 4.2
	},
	{
		id: 7,
		name: 'Notebook A5',
		price: 9,
		category: 'office',
		description: 'Hardcover dotted notebook 200 pages',
		stock: 300,
		rating: 4.5
	},
	{
		id: 8,
		name: 'Yoga Mat',
		price: 49,
		category: 'sports',
		description: 'Non-slip 6mm thick yoga mat',
		stock: 90,
		rating: 4.6
	},
	{
		id: 9,
		name: 'Water Bottle',
		price: 22,
		category: 'sports',
		description: 'Insulated stainless steel 750ml bottle',
		stock: 150,
		rating: 4.8
	},
	{
		id: 10,
		name: 'Backpack 30L',
		price: 89,
		category: 'travel',
		description: 'Lightweight hiking backpack with laptop compartment',
		stock: 40,
		rating: 4.5
	}
]
