<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">Task Manager</div>
        <div class="text-subtitle2">Organize your tasks effectively</div>
      </q-card-section>
    </q-card>

    <!-- Alert for validation -->
    <q-alert
      v-if="alertMessage"
      :color="alertType"
      icon="warning"
      class="q-mb-md"
      dense
      dismissible
      @dismiss="alertMessage = ''"
    >
      {{ alertMessage }}
    </q-alert>

    <!-- Input and Actions -->
    <q-card class="q-pa-md shadow-1">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-9">
            <q-input
              filled
              v-model="newTask"
              label="Enter a new task"
              @keyup.enter="addTask"
              clearable
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn-group spread>
              <q-btn label="Add" color="primary" @click="addTask" />
              <q-btn label="Clear Completed" color="negative" @click="clearCompleted" />
            </q-btn-group>
          </div>
        </div>
      </q-card-section>

      <q-separator spaced />

      <!-- Filter Toggle -->
      <q-card-section>
        <q-btn-toggle
          v-model="filter"
          toggle-color="primary"
          spread
          no-caps
          unelevated
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Completed', value: 'completed' }
          ]"
        />
      </q-card-section>
    </q-card>

    <!-- Task List -->
    <q-card class="shadow-1">
      <q-list bordered separator>
        <q-item v-for="(task, index) in filteredTasks" :key="index">
          <q-item-section avatar>
            <q-checkbox v-model="task.done" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-input
              v-model="task.text"
              dense
              borderless
              :readonly="task.done"
              :style="{ textDecoration: task.done ? 'line-through' : 'none' }"
              class="full-width"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn flat round icon="delete" color="negative" @click="removeTask(index)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Summary Banner -->
    <q-banner class="q-mt-md bg-grey-3 text-dark rounded-borders shadow-1">
      <q-icon name="list_alt" class="q-mr-sm" />
      Total: {{ tasks.length }} | Remaining: {{ tasks.filter(t => !t.done).length }}
    </q-banner>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const newTask = ref('')
const tasks = ref([])
const filter = ref('all')

const alertMessage = ref('')
const alertType = ref('warning')

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => !t.done)
  if (filter.value === 'completed') return tasks.value.filter(t => t.done)
  return tasks.value
})

onMounted(() => {
  const saved = localStorage.getItem('tasks')
  if (saved) tasks.value = JSON.parse(saved)
})

watch(tasks, (newVal) => {
  localStorage.setItem('tasks', JSON.stringify(newVal))
}, { deep: true })

function showAlert(message, type = 'warning') {
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => {
    alertMessage.value = ''
  }, 3000)
}

function addTask() {
  const taskText = newTask.value.trim()
  if (!taskText) {
    showAlert('Task name cannot be blank.', 'warning')
    return
  }

  const duplicate = tasks.value.some(t => t.text.trim().toLowerCase() === taskText.toLowerCase())
  if (duplicate) {
    showAlert('Task already exists.', 'negative')
    return
  }

  tasks.value.push({ text: taskText, done: false })
  newTask.value = ''
  showAlert('Task added successfully.', 'positive')
}

function removeTask(index) {
  tasks.value.splice(index, 1)
}

function clearCompleted() {
  tasks.value = tasks.value.filter(task => !task.done)
}
</script>