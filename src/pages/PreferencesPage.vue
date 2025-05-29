<template>
  <div class="q-pa-md q-gutter-md flex justify-center">

    <q-card style="max-width: 480px; width: 100%;" flat bordered rounded>

      <!-- Header -->
      <q-card-section class="bg-primary text-white rounded-top shadow-2">
        <div class="text-h5">Preferences</div>
        <div class="text-subtitle2 q-mt-xs">Customize how the app works for you</div>
      </q-card-section>

      <!-- Preferences Form -->
      <q-card-section class="q-pt-lg q-pb-xl q-gutter-md">

        <!-- Dark Mode Toggle -->
        <q-tooltip anchor="top middle" self="bottom middle" class="bg-grey-8 text-white">
          Switch between Light and Dark themes
        </q-tooltip>
        <q-toggle
          v-model="preferences.darkMode"
          label="Enable Dark Mode"
          @update:model-value="toggleDarkMode"
          dense
          color="primary"
          keep-focus
        />

        <!-- Notifications Checkboxes -->
        <q-tooltip anchor="top middle" self="bottom middle" class="bg-grey-8 text-white">
          Choose which notifications to receive
        </q-tooltip>
        <q-option-group
          v-model="preferences.notifications"
          type="checkbox"
          :options="notificationOptions"
          label="Notifications"
          color="primary"
          inline
        />

        <!-- Vibration Toggle -->
        <q-toggle
          v-model="preferences.vibration"
          label="Enable Vibration for Notifications"
          color="primary"
          dense
        >
          <template v-slot:hint>
            Vibrate device when notification arrives (if supported)
          </template>
        </q-toggle>

        <!-- Language Selection -->
        <q-select
          v-model="preferences.language"
          label="Language"
          :options="languages"
          filled
          clearable
          color="primary"
        />

        <!-- Font Size Slider -->
        <q-slider
          v-model="preferences.fontSize"
          label="Font Size"
          :min="12"
          :max="24"
          step="1"
          color="primary"
          class="q-mt-md"
          :label-always="true"
          :label-value="preferences.fontSize + 'px'"
        />

        <!-- Timezone Selection -->
        <q-select
          v-model="preferences.timezone"
          label="Timezone"
          :options="timezones"
          filled
          color="primary"
          emit-value
          map-options
          clearable
          class="q-mt-md"
        />

        <q-btn
          label="Detect My Timezone"
          icon="my_location"
          color="secondary"
          flat
          dense
          class="q-mb-md"
          @click="detectTimezone"
        />

        <!-- Buttons -->
        <div class="row justify-between q-mt-lg">
          <q-btn flat color="negative" label="Reset to Defaults" @click="resetPreferences" />
          <q-btn color="primary" label="Save Preferences" @click="savePreferences" unelevated rounded />
        </div>

      </q-card-section>
    </q-card>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const defaultPreferences = {
  darkMode: false,
  notifications: ['reminders'],
  vibration: false,
  language: 'English',
  fontSize: 16,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

const preferences = ref({ ...defaultPreferences })

const notificationOptions = [
  { label: 'Task Reminders', value: 'reminders' },
  { label: 'Project Updates', value: 'projects' },
  { label: 'Weekly Summary', value: 'summary' }
]

const languages = ['English', 'Filipino', 'Spanish']

// A basic list of common timezones (can be expanded)
const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Manila',
  'Asia/Tokyo',
  'Australia/Sydney'
].map(tz => ({ label: tz, value: tz }))

// Load saved preferences from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('userPreferences')
  if (saved) {
    try {
      Object.assign(preferences.value, JSON.parse(saved))
      $q.dark.set(preferences.value.darkMode)
      applyFontSize()
    } catch { /* ignore errors */ }
  } else {
    $q.dark.set(preferences.value.darkMode)
    applyFontSize()
  }
})

function toggleDarkMode(value) {
  $q.dark.set(value)
}

watch(() => preferences.value.darkMode, (newVal) => {
  $q.dark.set(newVal)
}, { immediate: true })

// Apply font size to body
function applyFontSize() {
  document.documentElement.style.setProperty('--app-font-size', preferences.value.fontSize + 'px')
}
watch(() => preferences.value.fontSize, applyFontSize)

function savePreferences() {
  localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
  $q.notify({
    type: 'positive',
    message: 'Preferences saved successfully'
  })
}

function resetPreferences() {
  preferences.value = { ...defaultPreferences }
  $q.dark.set(preferences.value.darkMode)
  applyFontSize()
  $q.notify({
    type: 'info',
    message: 'Preferences reset to defaults'
  })
}

function detectTimezone() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  preferences.value.timezone = tz
  $q.notify({
    type: 'positive',
    message: `Detected timezone: ${tz}`
  })
}
</script>

<style scoped>
:root {
  --app-font-size: 16px;
}

body {
  font-size: var(--app-font-size);
  transition: font-size 0.3s ease;
}
</style>