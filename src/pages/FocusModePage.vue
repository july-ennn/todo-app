<!-- src/pages/FocusMode.vue -->
<template>
  <q-page padding>

    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-3 rounded-borders q-mb-md">
      <q-card-section>
        <div class="text-h5">Focus Mode</div>
        <div class="text-subtitle2">Boost productivity with Pomodoro timer</div>
      </q-card-section>
    </q-card>

    <!-- Timer Display Card -->
    <q-card class="q-pa-lg q-mb-md flex flex-center column rounded-borders" style="max-width: 350px; margin: auto;">
      <div class="text-h1 q-mb-md monospace">{{ formattedTime }}</div>

      <q-btn
        :label="isRunning ? 'Pause' : time.value === 0 ? 'Restart' : 'Start'"
        color="primary"
        class="q-mb-sm"
        @click="toggleTimer"
        style="min-width: 120px"
      />
      <q-btn
        label="Reset"
        color="secondary"
        flat
        @click="resetTimer"
        style="min-width: 120px"
      />

      <q-separator spaced class="q-my-md" />

      <div class="text-subtitle1 q-mb-sm">Select Timer Duration</div>
      <q-btn-toggle
        v-model="selectedDuration"
        :options="durations"
        color="primary"
        unelevated
        toggle-color="primary"
        glossy
        size="md"
      />

      <div class="q-mt-lg text-subtitle2">
        Sessions Completed: <strong>{{ sessionsCompleted }}</strong>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'

const durations = [
  { label: 'Pomodoro (25m)', value: 25 * 60 },
  { label: 'Short Break (5m)', value: 5 * 60 },
  { label: 'Long Break (15m)', value: 15 * 60 }
]

const selectedDuration = ref(durations[0].value)
const time = ref(selectedDuration.value)
const isRunning = ref(false)
const sessionsCompleted = ref(0)
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60).toString().padStart(2, '0')
  const seconds = (time.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

function playSound() {
  const audio = new Audio(
    'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'
  )
  audio.play()
}

function toggleTimer() {
  if (isRunning.value) {
    clearInterval(timer)
    isRunning.value = false
    Notify.create({ type: 'info', message: 'Timer paused' })
  } else {
    if (time.value === 0) {
      time.value = selectedDuration.value
    }
    timer = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        clearInterval(timer)
        isRunning.value = false
        playSound()
        Notify.create({ type: 'positive', message: 'Time is up!' })

        if (selectedDuration.value === durations[0].value) {
          sessionsCompleted.value++
        }
      }
    }, 1000)
    isRunning.value = true
    Notify.create({ type: 'positive', message: 'Timer started' })
  }
}

function resetTimer() {
  clearInterval(timer)
  time.value = selectedDuration.value
  isRunning.value = false
  Notify.create({ type: 'warning', message: 'Timer reset' })
}

watch(selectedDuration, (newVal) => {
  clearInterval(timer)
  time.value = newVal
  isRunning.value = false
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.monospace {
  font-family: 'Courier New', Courier, monospace;
}
</style>