import info from '../assets/pricing-info.json'
const discounts = info.discounts
const vipDiscounts = info.vipDiscounts
const basePrices: { [type: string]: number } = info.basePrices
const bySku: { [sku: string]: number } = info.bySku

interface PriceArgs {
  skus: Item[]
  asVip: boolean
  pricingTier: number
}

export default class Pricing {
  skus: Item[]
  isVip: boolean
  pricingTier: number

  constructor (isVip: boolean = false, pricingTier: number = 2) {
    this.skus = []
    this.isVip = isVip
    this.pricingTier = pricingTier
  }

  set selectedItems (skus: Item[]) {
    this.skus = skus
  }

  getBaseSingle ({ clothingType, sku = '' }: Item): number {
    if (clothingType === 'bag') return bySku[sku]

    return basePrices[clothingType]
  }

  get currentPrice (): number {
    return this.fullPrice * (1 - this.discount)
  }

  // this would be the full price if all items were non-vip
  // and the cost of the first item
  get fullPrice (): number {
    return this.skus.reduce((carry: number, item: Item) => {
      if (item.clothingType === 'bag') return carry + bySku[item.sku]

      return carry + basePrices[item.clothingType]
    }, 0)
  }
  getPriceOfSkus ({ skus, asVip = false, pricingTier = 2 }: PriceArgs): { basePrice: number, discountedPrice: number, discount: number } {
    const basePrice = skus.reduce((carry: number, item: Item) => {
      if (item.clothingType === 'bag') return carry + bySku[item.sku]
      return carry + basePrices[item.clothingType]
    }, 0)

    const discountArr = asVip ? vipDiscounts[this.pricingTier] : discounts
    let discount = skus.length === 0 ? 0 : discountArr[Math.min(discountArr.length - 1, skus.length - 1)]
    // console.log('getPriceOfSkus discount', discount)
    return { basePrice, discountedPrice: basePrice * (1 - discount), discount }
  }

  get discount () {
    if (this.skus.length === 0) return 0

    const discountArr = this.isVip ? vipDiscounts[this.pricingTier] : discounts
    const index = Math.min(discountArr.length - 1, this.skus.length - 1)
    // console.log('discountArr', discountArr, 'discount index', index, 'value', discountArr[index])
    return discountArr[index]
  }

  // gets the price of the next item that would be added in this category
  getNextPrice ({ item, asVip }: {item: Item, asVip: boolean}): { nextBasePrice: number, nextItemPrice: number } {
    const { basePrice, discountedPrice: nextTotalPrice } = this.getPriceOfSkus({ skus: [...this.skus, item], asVip, pricingTier: this.pricingTier })

    return { nextBasePrice: basePrice, nextItemPrice: nextTotalPrice - this.currentPrice }
  }

  get nextDiscount (): number {
    const discountArr = this.isVip ? vipDiscounts[this.pricingTier] : discounts
    return discountArr[Math.min(discountArr.length - 1, this.skus.length)]
  }
}
