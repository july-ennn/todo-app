<template>
  <q-page padding class="column">
    <!-- Work Tags Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md">
      <q-card-section>
        <div class="text-h5">Work Tags</div>
        <div class="text-subtitle2">Tasks categorized under your professional work tags.</div>
      </q-card-section>
    </q-card>

    <div class="row items-center justify-between q-mb-md">
      <q-btn dense flat icon="refresh" label="Reset Filters" @click="resetFilters" color="primary" />
    </div>

    <div class="row q-mb-md q-gutter-sm items-center">
      <q-input
        dense debounce="300"
        v-model="searchQuery"
        placeholder="Search work tagged tasks..."
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
        outlined
        clearable
        class="col-4 col-sm-3 col-md-2"
      />
    </div>

    <q-list bordered separator>
      <q-item v-for="task in filteredTasks" :key="task.id" clickable>
        <q-item-section>
          <q-item-label :class="{ 'text-strike': task.completed }">{{ task.title }}</q-item-label>
          <q-item-label caption>
            Status: 
            <q-chip :color="task.completed ? 'green' : 'orange'" dense outline size="xs">
              {{ task.completed ? 'Completed' : 'Pending' }}
            </q-chip>
          </q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round dense flat icon="done" color="green"
            v-if="!task.completed"
            @click.stop="markComplete(task)"
            v-tooltip="'Mark as completed'"
            size="sm"
          />
          <q-icon
            name="check_circle" color="green"
            v-else
            size="lg"
            class="q-ml-sm"
          />
          <q-btn
            round dense flat icon="delete" color="negative"
            @click.stop="deleteTask(task)"
            v-tooltip="'Delete task'"
            size="sm"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredTasks.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No work tagged tasks found.</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample task data tagged as 'Work'
const tasks = ref([
  { id: 4, title: 'Finish project documentation', tags: ['Work'], completed: false },
  { id: 5, title: 'Team meeting prep', tags: ['Work'], completed: true },
  { id: 6, title: 'Code review', tags: ['Work'], completed: false }
])

// Search query model
const searchQuery = ref('')

// Filter status model: null=all, true=completed, false=pending
const filterStatus = ref(null)

// Options for status filter select
const filterOptions = [
  { label: 'All', value: null },
  { label: 'Completed', value: true },
  { label: 'Pending', value: false }
]

// Filter tasks to only those tagged with 'Work'
const workTasks = computed(() => tasks.value.filter(task => task.tags.includes('Work')))

// Compute filtered tasks based on search and status filter
const filteredTasks = computed(() => {
  return workTasks.value.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === null || task.completed === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

// Mark task as completed
function markComplete(task) {
  task.completed = true
}

// Delete a task
function deleteTask(task) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

// Reset filters
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