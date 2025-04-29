<template>
  <h1 class="text-2xl font-bold mb-6">Control Panel</h1>
  <div class="mb-2">
    <strong>🔋Battery:</strong> {{ batteryVoltage ? batteryVoltage.toFixed(2) : 0 }} V ({{
      batteryPercentage
    }}%) at
    {{ batteryLastSeenAt }}
  </div>
  <div class="">
    <ImageUploader />
  </div>
</template>

<script setup>
import ImageUploader from './ImageUploader.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const batteryVoltage = ref(null)
const batteryLastSeenAt = ref(null)

const batteryPercentage = computed(() => {
  if (batteryVoltage.value !== null) {
    return voltageToPercentage(batteryVoltage.value)
  }
  return 0
})

onMounted(() => {
  fetchBatteryVoltage()
})

async function fetchBatteryVoltage() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/battery-latest`)
    const rawDate = new Date(response.data.timestamp)
    batteryVoltage.value = response.data.voltage_level
    batteryLastSeenAt.value = rawDate.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    console.log(response)
  } catch (error) {
    console.error('Error fetching battery voltage', error)
  }
}

function voltageToPercentage(voltage) {
  if (voltage >= 4.2) return 100
  if (voltage >= 4.0) return 85
  if (voltage >= 3.9) return 75
  if (voltage >= 3.8) return 50
  if (voltage >= 3.7) return 30
  if (voltage >= 3.6) return 20
  if (voltage >= 3.5) return 10
  if (voltage >= 3.4) return 5
  return 0 // Menos de 3.4V
}
</script>
