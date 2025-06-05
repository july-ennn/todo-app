<template>
  <q-page padding>
    <div class="q-pa-md">

      <!-- Header Card -->
      <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md">
        <q-card-section>
          <div class="text-h5">Calendar</div>
          <div class="text-subtitle2">A record of tasks you have scheduled and completed on your calendar.</div>
        </q-card-section>
      </q-card>

      <!-- Calendar Card -->
      <q-card class="shadow-2">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6">Calendar</div>

          <div class="row items-center q-gutter-sm">

            <q-select
              dense
              outlined
              :options="viewOptions"
              v-model="view"
              style="max-width: 120px;"
              label="View"
            />

            <q-btn dense flat icon="add" label="Add Task" @click="openAddDialog" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <div style="max-height: 650px; overflow-y: auto;">
            <q-calendar
              v-model="selectedDate"
              :view="view"
              :events="events"
              :event-name="eventName"
              bordered
              animated
              style="min-height: 600px;"
              @click-date="onDateClick"
              @click-event="editEvent"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog to Add/Edit Task -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 320px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ editEventMode ? 'Edit Task' : 'Add Task' }} - {{ selectedDate }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newEvent.title" label="Task Title" filled />
          <q-input v-model="newEvent.details" label="Task Description" type="textarea" filled class="q-mt-sm" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" :label="editEventMode ? 'Update' : 'Add'" @click="editEventMode ? updateEvent() : addEvent()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar'

const selectedDate = ref(new Date().toISOString().substr(0, 10))
const showDialog = ref(false)
const editEventMode = ref(false)
const selectedEventIndex = ref(null)

const newEvent = ref({
  title: '',
  details: ''
})

const events = ref([
  {
    name: 'Team Meeting',
    details: 'Zoom at 10AM',
    start: new Date().toISOString().substr(0, 10),
    color: 'primary',
    completed: true
  }
])

const eventName = event => {
  const status = event.completed ? '✔' : '✖'
  return `${status} ${event.name}`
}

const viewOptions = [
  { label: 'Year', value: 'year' },
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Day', value: 'day' }
]

const view = ref('month')

const onDateClick = (date) => {
  selectedDate.value = typeof date === 'string' ? date : date.date ?? new Date().toISOString().substr(0, 10)
  newEvent.value = { title: '', details: '' }
  editEventMode.value = false
  showDialog.value = true
}

const openAddDialog = () => {
  selectedDate.value = new Date().toISOString().substr(0, 10)
  newEvent.value = { title: '', details: '' }
  editEventMode.value = false
  showDialog.value = true
}

const addEvent = () => {
  if (!newEvent.value.title.trim()) return
  events.value.push({
    name: newEvent.value.title,
    details: newEvent.value.details,
    start: selectedDate.value,
    color: 'secondary',
    completed: false
  })
  showDialog.value = false
}

const editEvent = ({ event, index }) => {
  selectedEventIndex.value = index
  selectedDate.value = event.start
  newEvent.value = { title: event.name, details: event.details }
  editEventMode.value = true
  showDialog.value = true
}

const updateEvent = () => {
  if (selectedEventIndex.value !== null && newEvent.value.title.trim()) {
    events.value[selectedEventIndex.value] = {
      ...events.value[selectedEventIndex.value],
      name: newEvent.value.title,
      details: newEvent.value.details
    }
    showDialog.value = false
    editEventMode.value = false
    selectedEventIndex.value = null
  }
}
</script>