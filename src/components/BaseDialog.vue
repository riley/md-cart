<template>
  <div class="overlay">
    <div class="container">
      <Card>
        <CardContent>
          <h2 class="title">{{ title }}</h2>
          <div class="message">
            <slot></slot>
          </div>
          <div class="actions">
            <button class="cancel" @click="handleCancel">{{ cancelText }}</button>
            <button class="confirm" @click="handleConfirm">{{ confirmText }}</button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'

@Component({ components: { Card, CardContent } })
export default class Dialog extends Vue {
  @Prop({ type: String, required: true }) title: string
  @Prop({ type: String, required: true }) message: string
  @Prop({ type: String, required: true }) confirmText: string
  @Prop({ type: String, required: true }) cancelText: string

  mounted () {
    document.body.style.overflow = 'hidden'
  }

  destroyed () {
    document.body.style.overflow = 'auto'
  }

  handleConfirm () {
    this.$emit('confirm')
  }

  handleCancel () {
    this.$emit('cancel')
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 25rem;
  width: 100%;
  padding: 1rem;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.message {
  margin: 0.5rem 0;
  font-size: 1rem;
  text-align: left;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.cancel {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #D06B64;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.confirm {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #6B7D79;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
