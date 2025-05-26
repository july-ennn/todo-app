<template>
  <div class="q-pa-md">
    <q-input
      filled
      v-model="newTask"
      label="New Task"
      @keyup.enter="addTask"
    />
    <q-btn label="Add" color="primary" class="q-mt-sm" @click="addTask" />
    <q-btn label="Clear Completed" color="negative" class="q-mt-sm" @click="clearCompleted" />
  </div>

  <div class="q-pa-md q-mt-md q-mb-md" style="max-width: 400px;">
    <q-segment
        v-model="filter"
        dense
        :options="[
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' }
        ]"
    />
  </div>

  <q-list class="q-pa-md">
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
        <q-btn flat round icon="delete" @click="removeTask(index)" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-banner class="q-mt-md bg-grey-2 text-center">
    Total Tasks: {{ tasks.length }} |
    Remaining: {{ tasks.filter(t => !t.done).length }}
  </q-banner>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

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