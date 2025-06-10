<!-- src/pages/SharedTasks.vue -->
<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section>
        <div class="text-h5">Shared Tasks</div>
        <div class="text-subtitle2">Manage tasks shared with you</div>
      </q-card-section>
    </q-card>

    <!-- Search and Add -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <q-input
        dense
        debounce="300"
        v-model="searchQuery"
        placeholder="Search tasks..."
        rounded
        filled
        clearable
        class="col-8 col-sm-6 col-md-4"
        :rules="[val => val !== '']"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-btn
        dense
        icon="add"
        label="Add Task"
        color="primary"
        class="col-auto"
        @click="openDialog(true)"
      />
    </div>

    <!-- Tasks List -->
    <q-list bordered separator>
      <q-item v-for="task in filteredTasks" :key="task.id" clickable @click="openDialog(false, task)">
        <q-item-section>
          <q-item-label :class="task.completed ? 'text-strike text-grey-6' : ''">{{ task.title }}</q-item-label>
          <q-item-label caption>Shared by: {{ task.sharedBy }}</q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round
            dense
            flat
            :icon="task.completed ? 'undo' : 'done'"
            :color="task.completed ? 'warning' : 'positive'"
            @click.stop="toggleComplete(task)"
            v-tooltip="task.completed ? 'Mark as Incomplete' : 'Mark as Complete'"
            size="sm"
          />
          <q-btn
            round
            dense
            flat
            icon="edit"
            color="primary"
            @click.stop="openDialog(false, task)"
            v-tooltip="'Edit task'"
            size="sm"
          />
          <q-btn
            round
            dense
            flat
            icon="delete"
            color="negative"
            @click.stop="confirmDelete(task.id)"
            v-tooltip="'Delete task'"
            size="sm"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredTasks.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No tasks found.</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section>
          <q-input v-model="currentTask.title" label="Task Title" autofocus />
          <q-input v-model="currentTask.sharedBy" label="Shared By" class="q-mt-md" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="dialogOpen = false" />
          <q-btn flat label="Save" @click="saveTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmOpen" persistent>
      <q-card>
        <q-card-section class="text-h6">
          Are you sure you want to delete this task?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="deleteConfirmOpen = false" />
          <q-btn flat label="Delete" color="negative" @click="deleteTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const sharedTasks = ref([
  { id: 1, title: 'Finish report', sharedBy: 'Alice', completed: false },
  { id: 2, title: 'Update website', sharedBy: 'Bob', completed: true }
])

const searchQuery = ref('')
const dialogOpen = ref(false)
const deleteConfirmOpen = ref(false)

const currentTask = ref({ id: null, title: '', sharedBy: '', completed: false })
let deleteTaskId = null

const filteredTasks = computed(() => {
  if (!searchQuery.value) return sharedTasks.value
  return sharedTasks.value.filter(t =>
    t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.sharedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openDialog(isNew = true, task = null) {
  if (isNew) {
    currentTask.value = { id: null, title: '', sharedBy: '', completed: false }
  } else if (task) {
    currentTask.value = { ...task }
  }
  dialogOpen.value = true
}

function saveTask() {
  if (!currentTask.value.title || !currentTask.value.sharedBy) return

  if (currentTask.value.id) {
    const index = sharedTasks.value.findIndex(t => t.id === currentTask.value.id)
    if (index !== -1) sharedTasks.value[index] = { ...currentTask.value }
  } else {
    sharedTasks.value.push({
      id: Date.now(),
      title: currentTask.value.title,
      sharedBy: currentTask.value.sharedBy,
      completed: false
    })
  }
  dialogOpen.value = false
}

function toggleComplete(task) {
  task.completed = !task.completed
}

function confirmDelete(id) {
  deleteTaskId = id
  deleteConfirmOpen.value = true
}

function deleteTask() {
  sharedTasks.value = sharedTasks.value.filter(t => t.id !== deleteTaskId)
  deleteConfirmOpen.value = false
}
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
}
.rounded-borders {
  border-radius: 12px;
}
</style>