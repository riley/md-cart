import _Vue from 'vue'
import * as info from '../assets/pricing-matrix.json'
const matrix: PricingMatrix = info.matrix
const bySku: BySku = info.bySku

interface PricingMatrix {
  [clothingType: string]: {
    nvip: number[],
    vip: number[],
    ncont: number,
    vcont: number
  }
}

interface BySku {
  [sku: string]: number
}

export default {
  install (Vue: typeof _Vue, options?: any): void {
    Vue.prototype.$baseSingle = (clothingType: string, sku: string = ''): number => {
      if (clothingType === 'bag') return bySku[sku]

      return matrix[clothingType].nvip[1]
    }
  }
}
