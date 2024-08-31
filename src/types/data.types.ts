export interface IFormDetails {
	name: string
	surname: string
	gender: EnumGender
}

export enum EnumGender {
	Male,
	Female,
}

export interface IProduct {
	id: string
	title: string
	price: number
	description: string
}

export interface IWebData {
	products: IProduct[]
	totalPrice: number
	queryId: string
}
