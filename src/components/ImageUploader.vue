<template>
  <h1 class="text-xl font-bold mb-4">Upload Image</h1>
  <div class="bg-gray-100 p-4">
    <!-- Input file -->
    <input type="file" @change="onFileChange" accept="image/*" class="hidden" />

    <label
      v-if="!previewUrl"
      class="w-64 mx-auto mb-4 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-gray-200 cursor-pointer hover:bg-blue hover:text-gray-700"
    >
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
        />
      </svg>
      <span class="mt-2 text-base leading-normal font-semibold">Select a file</span>
      <input type="file" @change="onFileChange" class="hidden" />
    </label>

    <!-- Cropper -->
    <div v-if="img" class="cropper-container">
      <cropper
        class="cropper"
        :src="img"
        :stencil-props="{ aspectRatio: 800 / 480 }"
        @change="onCropChange"
        @ready="onImageReady"
        @error="onImageError"
      />
    </div>
  </div>

  <!-- Botones -->
  <div v-if="img" class="flex space-x-4 mt-4">
    <button
      @click="uploadImage"
      :disabled="!cropCanvas || loading"
      class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded"
    >
      Upload Cropped Image
    </button>
    <button
      @click="onClearImage"
      class="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
    >
      Clear
    </button>
  </div>

  <!-- Mensaje -->
  <p v-if="message" :class="{ 'text-green-600': success, 'text-red-600': !success }" class="mt-4">
    {{ message }}
  </p>
</template>

<script>
import axios from 'axios'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const apiURL = import.meta.env.VITE_API_URL

export default {
  components: {
    Cropper,
  },
  data() {
    return {
      img: null,
      cropCanvas: null, // <- canvas para enviar como blob
      selectedFile: null,
      previewUrl: null,
      message: '',
      success: false,
      loading: false,
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      this.selectedFile = file
      this.previewUrl = URL.createObjectURL(file)
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.img = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    onCropChange({ canvas }) {
      this.cropCanvas = canvas
    },
    onImageReady() {
      console.log('Image successfully loaded into the cropper!')
    },
    onImageError(error) {
      console.error('Error loading image into the cropper:', error)
    },
    onClearImage() {
      this.selectedFile = null
      this.img = null
      this.previewUrl = null
      this.cropCanvas = null
    },
    async uploadImage() {
      if (!this.cropCanvas) return

      this.loading = true
      this.message = ''
      this.success = false

      this.cropCanvas.toBlob(async (blob) => {
        const formData = new FormData()
        formData.append('image', blob, 'cropped.png')

        try {
          const response = await axios.post(`${apiURL}/upload-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          this.message = 'Upload successful!'
          this.success = true
          console.log(response.data)
        } catch (err) {
          console.error(err)
          this.message = 'Upload failed.'
          this.success = false
        } finally {
          this.loading = false
        }
      }, 'image/png')
    },
  },
}
</script>
