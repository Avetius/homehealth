<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4">
          <v-card-title>Upload IDs and Driver's License</v-card-title>
          <v-card-text>
            <p>Select files below (images or PDFs). You'll be able to preview them before sending.</p>

            <v-file-input v-model="idFile" label="Upload ID (front)" accept="image/*,.pdf"></v-file-input>
            <v-file-input v-model="dlFile" label="Upload Driver's License" accept="image/*,.pdf"></v-file-input>

            <div v-if="idPreview">
              <h4>ID Preview</h4>
              <img v-if="isImage(idPreview)" :src="idPreview" style="max-width:100%;height:auto;border:1px solid #ddd;" />
              <div v-else>Uploaded file ready (PDF preview not shown)</div>
            </div>

            <div v-if="dlPreview" class="mt-3">
              <h4>DL Preview</h4>
              <img v-if="isImage(dlPreview)" :src="dlPreview" style="max-width:100%;height:auto;border:1px solid #ddd;" />
              <div v-else>Uploaded file ready (PDF preview not shown)</div>
            </div>

            <v-btn color="secondary" class="mt-4 me-2" @click="verifyId" :disabled="!idFile || loading">Verify ID barcode</v-btn>
            <v-btn color="primary" class="mt-4" @click="submit" :disabled="!idFile || !dlFile || loading">Submit</v-btn>
            <div v-if="verified" class="mt-3">Decoded barcode: <strong>{{ verified }}</strong></div>
            <v-progress-linear v-if="loading" indeterminate class="mt-2"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const idFile = ref<File | null>(null)
const dlFile = ref<File | null>(null)
const idPreview = ref<string | null>(null)
const dlPreview = ref<string | null>(null)
const loading = ref(false)
const verified = ref<string | null>(null)

function isImage(dataUrl: string) {
  return dataUrl.startsWith('data:image')
}

// create previews when files change
watch(idFile, async (file) => {
  if (!file) { idPreview.value = null; return }
  idPreview.value = await toDataUrl(file)
})

watch(dlFile, async (file) => {
  if (!file) { dlPreview.value = null; return }
  dlPreview.value = await toDataUrl(file)
})

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function submit() {
  if (!idFile.value || !dlFile.value) return
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('id', idFile.value)
    payload.append('dl', dlFile.value)

    const res = await fetch('/api/upload', { method: 'POST', body: payload })
    if (!res.ok) throw new Error(await res.text())
    alert('Upload successful')
    idFile.value = null
    dlFile.value = null
    idPreview.value = null
    dlPreview.value = null
  } catch (e) {
    alert('Upload failed: ' + (e as Error).message)
  } finally {
    loading.value = false
  }
}

async function verifyId() {
  if (!idFile.value) return
  loading.value = true
  verified.value = null
  try {
    const payload = new FormData()
    payload.append('id', idFile.value)
    const res = await fetch('/api/verify-id', { method: 'POST', body: payload })
    const json = await res.json()
    if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to verify')
    verified.value = json.decoded
  } catch (e) {
    alert('Verification failed: ' + (e as Error).message)
  } finally {
    loading.value = false
  }
}
</script>
