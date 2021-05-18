import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $baseSingle: (clothingType: string, sku?: string) => number
    $nextVip: (clothingType: string, count?: number) => number
  }
}
