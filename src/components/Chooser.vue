<template>
  <div>
    <p class="chooser-cta">Select your variant below. Pick your preferred option to add it to your next VIP shipment.</p>
    <p class="abort" @click="$emit('abort')">Cancel [ × ]</p>
    <div class="chooser-root">
      <div class="picker">
        <div v-for="(prop, index) of propsAsTuples" :key="prop.field" :class="{disabled: index > selectedPropCount}">
          <p class="picker-label"><strong>Step {{ index + 1 }}:</strong> Select the {{ prop.field }}{{ getExtraFirstPrompt(index) }}</p>
          <div class="chooser-row" :class="{ skuGrid: prop.field === 'sku' }" :style="{ gridTemplateColumns: Array(getColumnCount(prop.field)).fill('1fr').join(' ') }">
            <div
              class="chooser-button"
              v-for="variant of prop.info"
              :key="variant.label"
              :class="{ [prop.field]: true, tagged: selectedProps[prop.field] === variant.value}"
              :style="{ backgroundImage: prop.field === 'sku' ? `url(https://mrdavis.com/img/swatches/${variant.value}.jpg)` : '' }"
              @click="selectProp(prop.field, variant.value)">
              {{ prop.field !== 'sku' ? variant.label : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import meta, { addMoreIcons, buyableCategories } from '../utils/product-meta'

@Component
export default class Chooser extends Vue {
  @Prop() stock: Product[]
  @Prop() upsells: any[]
  @Prop({ type: Boolean, default: false }) vipPricing: boolean
  @Prop() clothingType: string

  pickerOpen = false
  selectedProps: { [key: string]: string } = {}

  get selectedPropCount () {
    const { clothingType, ...propsWithoutType } = this.selectedProps
    return Object.keys(propsWithoutType).length
  }

  getColumnCount (field: string) {
    const maxColumns = window.screen.width > 768 ? 5 : 3

    return Math.min(maxColumns, meta[this.clothingType].props[field].length)
  }

  // TODO reset selectedProps when you re-open the chooser

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

  selectProp (field: string, value: string) {
    console.log(field, value)
    console.log(this.selectedProps)
    this.selectedProps = { ...this.selectedProps, clothingType: this.clothingType, [field]: value }

    const products = this.stock.filter((product: any) => {
      return Object.keys(this.selectedProps).every((key: string) => this.selectedProps[key] === product[key])
    })

    console.log('Chooser products', products)

    if (products.length === 1) {
      this.$emit('chosenProduct', products[0])
      this.selectedProps = {}
    }
  }

  getExtraFirstPrompt (index: number) {
    return index === 0 ? ` of your next ${meta[this.clothingType].prompt}` : ''
  }
}
</script>

<style scoped>
.chooser-cta {
  padding-bottom: 1rem;
}

.abort {
  text-align: right;
  font-size: .9em;
  color: #5b7975;
  margin: 0;
  padding: 0;
}

.abort:hover {
  cursor: pointer;
  text-decoration: underline;
}

.chooser-root {
  display: flex;
  background-color: rgba(91, 121, 117, .1);
  padding: 1rem;
}

.add-clothing {
  color: white;
  background-color: #5b7975;
  margin: 0 0 .5rem;
  padding: 1rem;
}

.picker-label {
  font-size: 1.4em;
  padding-bottom: .15rem;
  margin-left: .5rem;
}

.chooser-row {
  display: grid;
  gap: .25rem;
}

.chooser-row.skuGrid {
  grid-template-columns: repeat(5, 1fr);
}

.chooser-row.skuGrid .chooser-button {
  margin-bottom: 0;
  background-size: cover;
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
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-family: Jost, sans-serif;
  cursor: pointer;
  min-height: 55px;
  border: 2px solid #e7e7e7;
  background: #fff;
}

.chooser-button:first-child {
  margin-left: 0 !important;
}

.chooser-button:last-child {
  margin-right: 0 !important;
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
