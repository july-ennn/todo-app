<template>
  <q-page padding class="column">
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-negative text-white shadow-2 q-mb-md">
      <q-card-section>
        <div class="text-h5">Urgent Tasks</div>
        <div class="text-subtitle2">Tasks that need your immediate attention.</div>
      </q-card-section>
    </q-card>

    <!-- Filters and Search -->
    <div class="row q-mb-md q-gutter-sm items-center">
      <q-input
        dense debounce="300"
        v-model="searchQuery"
        placeholder="Search urgent tasks..."
        rounded filled clearable
        class="col-8 col-sm-6 col-md-4"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>

      <q-select
        dense
        v-model="filterStatus"
        :options="filterOptions"
        label="Filter by Status"
        outlined clearable
        class="col-4 col-sm-3 col-md-2"
      />

      <q-btn dense flat icon="refresh" label="Reset Filters" color="white" @click="resetFilters" />
    </div>

    <q-list bordered separator>
      <q-item
        v-for="task in filteredTasks"
        :key="task.id"
        clickable
        :class="{ 'overdue-task': isOverdue(task) && !task.completed }"
      >
        <q-item-section>
          <q-item-label :class="{ 'text-strike': task.completed }">{{ task.title }}</q-item-label>
          <q-item-label caption>
            Due: {{ formatDate(task.dueDate) }}
            <q-chip
              v-if="isOverdue(task) && !task.completed"
              color="negative"
              size="xs"
              class="q-ml-sm"
            >Overdue</q-chip>
          </q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round dense flat icon="check"
            color="green"
            @click.stop="markComplete(task)"
            v-if="!task.completed"
            size="sm"
            v-tooltip="'Mark as completed'"
          />
          <q-icon
            name="done_all"
            color="green"
            v-else
            size="lg"
            class="q-ml-sm"
          />
          <q-btn
            round dense flat icon="delete"
            color="negative"
            @click.stop="deleteTask(task)"
            size="sm"
            v-tooltip="'Delete this task'"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredTasks.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No urgent tasks found.</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// Task data with urgent tag
const tasks = ref([
  { id: 1, title: 'Fix critical bug', tags: ['Urgent'], completed: false, dueDate: '2025-06-01' },
  { id: 2, title: 'Respond to client email', tags: ['Urgent'], completed: true, dueDate: '2025-05-29' },
  { id: 3, title: 'Prepare urgent report', tags: ['Urgent'], completed: false, dueDate: null }
])

const searchQuery = ref('')
const filterStatus = ref(null)
const filterOptions = [
  { label: 'All', value: null },
  { label: 'Completed', value: true },
  { label: 'Pending', value: false }
]

const urgentTasks = computed(() => tasks.value.filter(t => t.tags.includes('Urgent')))

const filteredTasks = computed(() => {
  return urgentTasks.value.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === null || task.completed === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

function markComplete(task) {
  task.completed = true
}

function deleteTask(task) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) tasks.value.splice(index, 1)
}

function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = null
}

function formatDate(dateStr) {
  if (!dateStr) return 'No due date'
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function isOverdue(task) {
  if (!task.dueDate) return false
  const today = new Date()
  const due = new Date(task.dueDate)
  return due < today
}
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
  color: gray;
}
.overdue-task {
  background-color: #ffebee; /* light red background */
}
</style>