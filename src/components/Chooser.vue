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
      <p>Add clothing to your VIP</p>
      <div class="add-more-buttons">
        <button v-for="clothingType of buyables" class="add-more" :key="clothingType" @click="openPicker(clothingType)">{{ clothingType }} {{ pricing && pricing.nextItemPrice[clothingType].vipItemPrice / 100 }}</button>
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
  @Prop() pricing: Pricing

  pickerOpen = false
  clothingType: string = 'undershirts'
  selectedProps: { [key: string]: string } = {}

  get selectedPropCount () {
    return Object.keys(this.selectedProps).length
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
}
</script>

<style scoped>
.chooser-root {
  display: flex;
}

.chooser-root > div {
  flex: 1;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  clear: both;
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
</style>
