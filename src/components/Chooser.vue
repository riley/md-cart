<template>
  <div class="chooser-root">
    <div v-if="pickerOpen" class="picker">
      <div class="chooser-row" v-for="(prop, index) of propsAsTuples" :key="prop.field" :class="{disabled: index > selectedPropCount}">
        <div
          class="chooser-button"
          v-for="variant of prop.info"
          :key="variant.label"
          :class="{tagged: selectedProps[prop.field] === variant.value}"
          @click="selectProp(prop.field, variant.value)">
          {{ variant.label }}
        </div>
      </div>
    </div>
    <div v-if="!pickerOpen" class="add-more-prompt">
      <h4 class="add-clothing">Add clothing to your VIP</h4>
      <div class="add-more-buttons">
        <!-- <button v-for="clothingType of buyables" class="add-more" :key="clothingType" @click="openPicker(clothingType)">{{ clothingType }} {{ pricing && pricing.nextItemPrice[clothingType].vipItemPrice / 100 }}</button> -->
        <Upsell
          class="upsell"
          v-for="upsell in upsells"
          :key="upsell.clothingType"
          :price="getCost(upsell.clothingType)"
          :upsell="upsell"
          @select="pickerOpen = true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Upsell from '@/components/Upsell.vue'
import meta, { addMoreIcons, buyableCategories } from '../utils/product-meta'

@Component({ components: { Upsell } })
export default class Chooser extends Vue {
  @Prop() stock: Product[]
  @Prop() pricing: Pricing
  @Prop() upsells: any[]
  @Prop({ type: Boolean, default: false }) vipPricing: boolean
  @Prop({ default: [] }) items: Item[] // the currently selected items

  pickerOpen = false
  clothingType: string = 'undershirts'
  selectedProps: { [key: string]: string } = {}

  get selectedPropCount () {
    const { clothingType, ...propsWithoutType } = this.selectedProps
    return Object.keys(propsWithoutType).length
  }

  get propsAsTuples () {
    return Object.entries(meta[this.clothingType].props).reduce((carry: any, [field, infos]) => {
      const formattedInfo = infos.map(info => {
        if (typeof info === 'string') {
          return { label: info, value: info }
        } else {
          return info
        }
      })
      carry.push({ field, info: formattedInfo })
      return carry
    }, [])
  }

  get addMoreButtonsCart () {
    return meta[this.clothingType].addMore
  }

  get buyables () {
    return buyableCategories
  }

  openPicker (clothingType: string) {
    this.selectedProps = {}
    this.clothingType = clothingType
    this.pickerOpen = true
  }

  selectProp (field: string, value: string) {
    console.log(field, value)
    console.log(this.selectedProps)
    this.selectedProps = { ...this.selectedProps, clothingType: this.clothingType, [field]: value }

    const product = this.stock.filter((product: any) => {
      return Object.keys(this.selectedProps).every((key: string) => this.selectedProps[key] === product[key])
    })

    if (product.length === 1) {
      this.$emit('chosenProduct', product[0])
      this.pickerOpen = false
      this.selectedProps = {}
    }
  }

  getCost (clothingType: string) {
    return this.vipPricing ? this.$nextVip(clothingType, this.items.length + 1) : this.$baseSingle(clothingType)
  }
}
</script>

<style scoped>
.chooser-root {
  display: flex;
  background-color: rgba(91, 121, 117, .2);
  padding: 1rem;
}

.add-clothing {
  color: white;
  background-color: #5b7975;
  margin: 0 0 .5rem;
  padding: 1rem;
}

.chooser-row {
  display: flex;
}

.chooser-row.disabled {
  opacity: .3;
  pointer-events: none;
}

.chooser-button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  margin: 0 4px 12px !important;
  text-transform: uppercase;
  font-family: Open Sans,sans-serif;
  cursor: pointer;
  min-height: 55px;
  border: 2px solid #e7e7e7;
  background: #fff;
}

.chooser-button.tagged {
  background-color: #5b7975;
  color: white;
}

.add-more-buttons {
  /* display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  clear: both; */
}

.add-more:first-child {
  grid-column: 1/3;
}

.add-more {
  display: flex;
  justify-content: space-between;
  border: none;
  background: #fff;
  cursor: pointer;
  position: relative;
  padding: 14px 34px 14px 10px;
  box-shadow: 0 0 10px 1px rgba(0,0,0,.2);
  transition: all .3s .5s;
}

.upsell {
  margin-bottom: .5rem;
}

.picker {
  width: 100%;
}
</style>
