<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section>
        <div class="text-h5">Reports</div>
        <div class="text-subtitle2">Generate and export various reports</div>
      </q-card-section>
    </q-card>

    <!-- Report selector and buttons -->
    <div class="row q-gutter-sm items-center q-mb-md">
      <q-select
        v-model="selectedReport"
        :options="reportOptions"
        label="Select Report"
        dense
        outlined
        class="col-12 col-md-6"
      />
      <q-btn
        label="Generate Report"
        color="primary"
        :loading="loading"
        :disable="!selectedReport || loading"
        @click="generateReport"
        class="col-auto"
      />
      <q-btn
        label="Clear"
        color="secondary"
        flat
        :disable="!reportData || loading"
        @click="clearReport"
        class="col-auto"
      />
      <q-btn
        label="Export CSV"
        color="positive"
        flat
        :disable="!reportData || loading"
        @click="exportCSV"
        class="col-auto"
      />
    </div>

    <!-- Report display -->
    <q-card v-if="reportData" class="q-mt-lg">
      <q-card-section>
        <div class="text-h6 q-mb-sm">{{ selectedReport }}</div>
        <q-scroll-area style="height: 300px; max-width: 100%;">
          <pre class="q-pa-sm bg-grey-1 text-body1" style="white-space: pre-wrap;">{{ reportData }}</pre>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const reportOptions = [
  'Monthly Summary',
  'Task Completion',
  'User Activity'
]

const selectedReport = ref(null)
const reportData = ref(null)
const loading = ref(false)

function generateReport() {
  loading.value = true
  reportData.value = null
  setTimeout(() => {
    reportData.value = `Report: ${selectedReport.value}\nGenerated on: ${new Date().toLocaleString()}\n\nThis is some dummy report data.\n\n- Item 1\n- Item 2\n- Item 3`
    loading.value = false
  }, 1500) // simulate async operation
}

function clearReport() {
  reportData.value = null
  selectedReport.value = null
}

function exportCSV() {
  if (!reportData.value) return

  const csvContent = `"Report","${selectedReport.value}"\n"Generated On","${new Date().toLocaleString()}"\n\n"Data"\n"${reportData.value.replace(/\n/g, '"\n"')}"`

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${selectedReport.value.replace(/\s+/g, '_')}_Report.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>