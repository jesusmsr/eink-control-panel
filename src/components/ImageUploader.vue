<template>
  <div class="bg-white p-6 w-xl mx-auto mt-5">
    <h1 class="text-2xl font-bold mb-4">Upload Image to e-Ink Display</h1>

    <div class="bg-gray-200 p-6 w-150 h-100 mt-10 flex items-center justify-center">
      <label
        v-if="!previewUrl"
        class="w-64 mb-4 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-gray-200 cursor-pointer hover:bg-blue hover:text-gray-700"
      >
        <svg
          class="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
          />
        </svg>
        <span class="mt-2 text-base leading-normal font-semibold">Select a file</span>
        <input type="file" @change="onFileChange" class="hidden" />
      </label>

      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="mb-4 rounded max-w-full max-h-full object-contain"
      />
    </div>
    <div class="flex flex-row">
      <button
        @click="uploadImage"
        :disabled="!selectedFile || loading"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded mt-4 disabled:opacity-50"
      >
        <span v-if="loading">Uploading...</span>
        <span v-else>Upload</span>
      </button>
      <div class="w-2"></div>

      <button
        @click="onClearImage"
        :disabled="!selectedFile || loading"
        class="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mt-4 disabled:opacity-50"
      >
        <span>Clear</span>
      </button>
    </div>

    <p v-if="message" :class="{ 'text-green-600': success, 'text-red-600': !success }" class="mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
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
    },
    onClearImage(e) {
      this.selectedFile = null
      this.previewUrl = null
    },
    async uploadImage() {
      if (!this.selectedFile) return
      const formData = new FormData()
      formData.append('image', this.selectedFile)

      this.loading = true
      try {
        const response = await axios.post('http://eink-api.jsanr.dev/api/upload-image', formData, {
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
    },
  },
}
</script>
