<template>
  <q-page padding class="column">

    <!-- Pinned Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md">
      <q-card-section>
        <div class="text-h5">Pinned</div>
        <div class="text-subtitle2">A record of tasks you've successfully pinned and are managing here.</div>
      </q-card-section>
    </q-card>

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-warning">Pinned Tasks</div>
      <q-btn
        dense
        flat
        icon="refresh"
        label="Reset Filters"
        @click="resetFilters"
        color="primary"
      />
    </div>

    <!-- Search and Filter Controls -->
    <div class="row q-mb-md q-gutter-sm items-center">
      <q-input
        dense
        debounce="300"
        v-model="searchQuery"
        placeholder="Search pinned tasks..."
        rounded
        filled
        clearable
        class="col-8 col-sm-6 col-md-4"
        :rules="[val => val !== '']"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>

      <q-select
        dense
        v-model="filterStatus"
        :options="filterOptions"
        label="Filter"
        outlined
        class="col-4 col-sm-3 col-md-2"
        clearable
      />
    </div>

    <q-list bordered separator>
      <q-item v-for="task in filteredTasks" :key="task.id" clickable>
        <q-item-section>
          <q-item-label :class="{ 'text-strike': task.completed }">{{ task.title }}</q-item-label>
          <q-item-label caption>
            Status: <q-chip
              :color="task.completed ? 'green' : 'orange'"
              dense
              outline
              size="xs"
            >
              {{ task.completed ? 'Completed' : 'Pending' }}
            </q-chip>
          </q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round
            dense
            flat
            icon="push_pin_off"
            color="negative"
            @click.stop="unpinTask(task)"
            size="sm"
            v-tooltip="'Unpin this task'"
          />
          <q-btn
            round
            dense
            flat
            icon="check"
            color="positive"
            @click.stop="markComplete(task)"
            v-if="!task.completed"
            size="sm"
            v-tooltip="'Mark as completed'"
          />
          <q-icon
            name="check_circle"
            color="green"
            v-else
            size="lg"
            class="q-ml-sm"
          />
          <q-btn
            round
            dense
            flat
            icon="delete"
            color="negative"
            @click.stop="deleteTask(task)"
            size="sm"
            v-tooltip="'Delete this task'"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredTasks.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No pinned tasks found.</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const tasks = ref([
  { id: 1, title: 'Prepare presentation', pinned: true, completed: false },
  { id: 2, title: 'Fix critical bug', pinned: true, completed: false },
  { id: 3, title: 'Reply to urgent email', pinned: true, completed: true },
  { id: 4, title: 'Plan team event', pinned: false, completed: false }
])

const searchQuery = ref('')
const filterStatus = ref(null)
const filterOptions = [
  { label: 'All', value: null },
  { label: 'Completed', value: true },
  { label: 'Pending', value: false }
]

const pinnedTasks = computed(() => tasks.value.filter(t => t.pinned))

const filteredTasks = computed(() => {
  return pinnedTasks.value.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = filterStatus.value === null || task.completed === filterStatus.value
    return matchesSearch && matchesFilter
  })
})

function unpinTask(task) {
  task.pinned = false
}

function markComplete(task) {
  task.completed = true
}

function deleteTask(task) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = null
}
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
  color: gray;
}
</style>