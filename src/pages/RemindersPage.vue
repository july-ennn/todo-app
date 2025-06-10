<!-- src/pages/Reminders.vue -->
<template>
  <q-page padding>

    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-3 rounded-borders">
      <q-card-section>
        <div class="text-h5">Reminders</div>
        <div class="text-subtitle2">Organize your personal goals and tasks</div>
      </q-card-section>
    </q-card>

    <!-- Search & Add Button -->
    <div class="row items-center q-my-md">
      <q-input
        filled
        debounce="300"
        v-model="searchTerm"
        label="Search reminders"
        clearable
        dense
        class="col"
        :disable="reminders.length === 0"
        :placeholder="reminders.length ? 'Search by title...' : 'No reminders yet'"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        icon="add"
        label="Add Reminder"
        color="primary"
        class="q-ml-md"
        @click="openDialog = true"
      />
    </div>

    <!-- Reminders List -->
    <q-list bordered separator class="rounded-borders" style="max-height: 60vh; overflow-y: auto;">
      <q-item
        v-for="reminder in filteredReminders"
        :key="reminder.id"
        clickable
        :class="{'bg-grey-2': reminder.done}"
      >
        <q-item-section>
          <q-item-label :class="{'text-line-through': reminder.done}">
            {{ reminder.title }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="event" size="14px" /> {{ formatDate(reminder.date) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            flat
            round
            dense
            :icon="reminder.done ? 'check_circle' : 'radio_button_unchecked'"
            :color="reminder.done ? 'positive' : 'grey-5'"
            @click.stop="toggleDone(reminder)"
            :aria-label="reminder.done ? 'Mark as undone' : 'Mark as done'"
          />
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click.stop="deleteReminder(reminder.id)"
            aria-label="Delete reminder"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="filteredReminders.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6 q-pa-md">No reminders found.</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add Reminder Dialog -->
    <q-dialog v-model="openDialog" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6 q-mb-md">Add New Reminder</div>
          <q-input
            v-model="newReminder.title"
            label="Reminder Title"
            autofocus
            :rules="[val => val && val.length > 2 || 'Title is required and must be at least 3 characters']"
            lazy-rules
          />
          <q-input
            v-model="newReminder.date"
            label="Date"
            type="date"
            :rules="[val => !!val || 'Date is required']"
            lazy-rules
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetForm" />
          <q-btn flat label="Add" color="primary" @click="addReminder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'

const reminders = ref([
  { id: 1, title: 'Meeting with team', date: '2025-06-10', done: false },
  { id: 2, title: 'Doctor Appointment', date: '2025-06-12', done: false }
])

const openDialog = ref(false)
const newReminder = ref({ title: '', date: '' })
const searchTerm = ref('')

// Format date to a readable form
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

// Computed filtered and sorted reminders by date ascending
const filteredReminders = computed(() => {
  return reminders.value
    .filter(r =>
      r.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Reset form fields
function resetForm() {
  newReminder.value = { title: '', date: '' }
}

// Add reminder with validation
function addReminder() {
  if (!newReminder.value.title || newReminder.value.title.length < 3) {
    Notify.create({ type: 'negative', message: 'Please enter a valid title (3+ chars).' })
    return
  }
  if (!newReminder.value.date) {
    Notify.create({ type: 'negative', message: 'Please select a valid date.' })
    return
  }

  reminders.value.push({
    id: Date.now(),
    title: newReminder.value.title,
    date: newReminder.value.date,
    done: false
  })

  Notify.create({ type: 'positive', message: 'Reminder added!' })

  resetForm()
  openDialog.value = false
}

// Delete reminder
function deleteReminder(id) {
  reminders.value = reminders.value.filter(r => r.id !== id)
  Notify.create({ type: 'info', message: 'Reminder deleted.' })
}

// Toggle done status
function toggleDone(reminder) {
  reminder.done = !reminder.done
  Notify.create({
    type: reminder.done ? 'positive' : 'info',
    message: reminder.done ? 'Marked as done.' : 'Marked as not done.'
  })
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.text-line-through {
  text-decoration: line-through;
}
</style>