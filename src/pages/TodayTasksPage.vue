<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">Today Tasks</div>
        <div class="text-subtitle2">Stay focused on what needs to be done today</div>
      </q-card-section>
    </q-card>

    <!-- Quick Add Task -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <q-input
            v-model="newTask"
            label="Task name"
            dense
            autofocus
            @keyup.enter="addTask"
            class="col-6"
            clearable
          />
          <q-input
            v-model="newTime"
            label="Due Time"
            dense
            type="time"
            class="col-3"
            clearable
          />
          <q-select
            v-model="newPriority"
            :options="['Low', 'Medium', 'High']"
            label="Priority"
            dense
            class="col-2"
          />
          <q-btn
            label="Add"
            color="primary"
            class="col-1"
            @click="addTask"
            :disable="!newTask.trim()"
            unelevated
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Filter Tabs -->
    <q-tabs
      v-model="filter"
      dense
      class="text-primary q-mt-md"
      align="justify"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="all" label="All" icon="list" />
      <q-tab name="active" label="Active" icon="schedule" />
      <q-tab name="completed" label="Completed" icon="check" />
    </q-tabs>

    <!-- Task List -->
    <q-card class="q-mt-sm">
      <q-card-section>
        <div class="text-h6 q-mb-sm">Your Tasks</div>

        <q-list bordered separator>
          <q-item
            v-for="(task, index) in filteredTasks"
            :key="task.id"
            :class="[
              task.done ? 'bg-grey-2' : '',
              isOverdue(task) && !task.done ? 'bg-red-1' : ''
            ]"
            class="q-mb-xs"
            @dblclick="editTask(index)"
            clickable
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="task.done"
                color="primary"
                @update:model-value="toggleDone(index)"
              />
            </q-item-section>

            <q-item-section class="q-pa-none q-pl-sm">
              <div
                v-if="editIndex === index"
                class="row items-center"
              >
                <q-input
                  v-model="editTaskText"
                  dense
                  autofocus
                  @keyup.enter="saveEdit(index)"
                  @blur="saveEdit(index)"
                  class="col"
                />
                <q-btn
                  icon="close"
                  dense
                  flat
                  color="negative"
                  @click="cancelEdit"
                  class="q-ml-sm"
                />
              </div>
              <div
                v-else
                class="text-subtitle1"
                :style="{ textDecoration: task.done ? 'line-through' : 'none' }"
                :title="'Double click to edit'"
              >
                {{ task.text }}
              </div>
              <div class="text-caption text-grey q-mt-xs">
                Due: 
                <span :class="{'text-negative': isOverdue(task) && !task.done}">
                  {{ task.time || 'N/A' }}
                </span> | Priority: 
                <q-badge :color="priorityColor(task.priority)" class="q-ml-xs">
                  {{ task.priority }}
                </q-badge>
              </div>
            </q-item-section>

            <q-item-section side>
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="removeTask(index)"
                v-tooltip="'Delete task'"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="filteredTasks.length === 0" class="text-center text-grey-6 q-pa-md">
          No tasks found. Add some tasks to stay productive! 🚀
        </div>
      </q-card-section>
    </q-card>

    <!-- Summary Banner -->
    <q-banner
      class="q-mt-md bg-grey-3 text-dark rounded-borders shadow-1"
      dense
    >
      <q-icon name="schedule" class="q-mr-sm" />
      Total: {{ tasks.length }} |
      Remaining: {{ tasks.filter(t => !t.done).length }} |
      Completed: {{ tasks.filter(t => t.done).length }}
    </q-banner>

  </div>
</template>

<script setup>

import { ref, computed } from 'vue'

const newTask = ref('')
const newTime = ref('')
const newPriority = ref('Medium')
const filter = ref('all')

const tasks = ref([
  { id: 1, text: 'Review meeting notes', done: false, time: '09:00', priority: 'High' },
  { id: 2, text: 'Finish wireframe for project', done: false, time: '13:00', priority: 'Medium' },
  { id: 3, text: 'Call supplier', done: true, time: '15:00', priority: 'Low' }
])

const editIndex = ref(null)
const editTaskText = ref('')

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value.trim(),
      done: false,
      time: newTime.value || null,
      priority: newPriority.value
    })
    newTask.value = ''
    newTime.value = ''
    newPriority.value = 'Medium'
  }
}

function removeTask(index) {
  if (editIndex.value === index) cancelEdit()
  tasks.value.splice(index, 1)
}

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => !t.done)
  if (filter.value === 'completed') return tasks.value.filter(t => t.done)
  return tasks.value
})

function priorityColor(priority) {
  if (priority === 'High') return 'red'
  if (priority === 'Medium') return 'orange'
  return 'green'
}

function isOverdue(task) {
  if (!task.time || task.done) return false
  const now = new Date()
  const [hours, minutes] = task.time.split(':').map(Number)
  const dueDate = new Date()
  dueDate.setHours(hours, minutes, 0, 0)
  return dueDate < now
}

function toggleDone(index) {
  if (editIndex.value === index) cancelEdit()
}

function editTask(index) {
  editIndex.value = index
  editTaskText.value = tasks.value[index].text
}

function saveEdit(index) {
  if (editTaskText.value.trim()) {
    tasks.value[index].text = editTaskText.value.trim()
  }
  editIndex.value = null
  editTaskText.value = ''
}

function cancelEdit() {
  editIndex.value = null
  editTaskText.value = ''
}
</script>

<style scoped>
.bg-red-1 {
  background-color: #ffcdd2 !important;
}
</style>