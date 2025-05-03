<template>
  <h1 class="text-2xl font-bold mb-6">Panel de control</h1>

  <div class="mb-2">
    <strong>
      <FontAwesomeIcon v-if="batteryPercentage > 75" icon="battery-full" />
      <FontAwesomeIcon v-else-if="batteryPercentage > 35" icon="battery-half" />
      <FontAwesomeIcon v-else icon="battery-empty" />
      Batería:
    </strong>
    {{ batteryVoltage?.toFixed(2) || 0 }} V ({{ batteryPercentage }}%) a
    {{ batteryLastSeenAt }}
  </div>

  <hr class="my-4 h-0.5 border-t-0 bg-neutral-200" />
  <ImageUploader />

  <hr class="my-4 h-0.5 border-t-0 bg-neutral-200" />

  <h1 class="text-2xl font-bold mb-6">Historial</h1>
  <div v-if="imageHistory != null">
    <ul class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <li v-for="url in imageHistory" :key="url">
        <img :src="url" alt="Historial" class="w-full rounded border" />
      </li>
    </ul>
  </div>
  <div v-else>
    <p>No hay imágenes en el historial.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ImageUploader from './ImageUploader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const apiURL = import.meta.env.VITE_API_URL
const batteryVoltage = ref(null)
const batteryLastSeenAt = ref(null)
let imageHistory = ref()

const batteryPercentage = computed(() => {
  if (batteryVoltage.value !== null) {
    return voltageToPercentage(batteryVoltage.value)
  }
  return 0
})

onMounted(() => {
  fetchBatteryVoltage()
  fetchImageHistory()
})

async function fetchBatteryVoltage() {
  try {
    const response = await axios.get(`${apiURL}/battery-latest`)
    const rawDate = new Date(response.data.timestamp)
    batteryVoltage.value = response.data.voltage_level
    batteryLastSeenAt.value = rawDate.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error fetching battery voltage', error)
  }
}

async function fetchImageHistory() {
  try {
    const response = await axios.get(`${apiURL}/latest-image`)
    imageHistory = response.data // asumimos que es un array de strings (URLs)
  } catch (error) {
    console.error('Error fetching image history', error)
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
  return 0
}
</script>
