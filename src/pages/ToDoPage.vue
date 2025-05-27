<template>
  <div class="q-pa-md">

    <!-- Add Task Input & Buttons -->
    <q-input
      filled
      v-model="newTask"
      label="New Task"
      @keyup.enter="addTask"
      clearable
    />
    <q-btn label="Add" color="primary" class="q-mt-sm" @click="addTask" />
    <q-btn label="Clear Completed" color="negative" class="q-mt-sm" @click="clearCompleted" />

    <!-- Filter Toggle -->
    <q-btn-toggle
      v-model="filter"
      toggle-color="primary"
      dense
      class="q-my-md"
      :options="[
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' }
      ]"
    />

    <!-- Tasks List -->
    <q-list bordered padding>
      <q-item v-for="(task, index) in filteredTasks" :key="index">
        <q-item-section avatar>
          <q-checkbox v-model="task.done" />
        </q-item-section>

        <q-item-section>
          <q-input
            v-model="task.text"
            dense
            borderless
            :readonly="task.done"
            :style="{ textDecoration: task.done ? 'line-through' : 'none' }"
          />
        </q-item-section>

        <q-item-section side>
          <q-btn flat round icon="delete" color="negative" @click="removeTask(index)" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Task Summary -->
    <q-banner class="q-mt-md bg-grey-2 text-center">
      Total Tasks: {{ tasks.length }} | Remaining: {{ tasks.filter(t => !t.done).length }}
    </q-banner>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const newTask = ref('')
const tasks = ref([])
const filter = ref('all')

const filteredTasks = computed(() => {
  if (filter.value === 'active') {
    return tasks.value.filter(t => !t.done)
  } else if (filter.value === 'completed') {
    return tasks.value.filter(t => t.done)
  }
  return tasks.value
})

onMounted(() => {
  const saved = localStorage.getItem('tasks')
  if (saved) {
    tasks.value = JSON.parse(saved)
  }
})

watch(tasks, (newVal) => {
  localStorage.setItem('tasks', JSON.stringify(newVal))
}, { deep: true })

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({ text: newTask.value, done: false })
    newTask.value = ''
  }
}

function removeTask(index) {
  tasks.value.splice(index, 1)
}

function clearCompleted() {
  tasks.value = tasks.value.filter(task => !task.done)
}
</script>