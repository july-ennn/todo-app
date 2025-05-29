<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">Upcoming Tasks</div>
        <div class="text-subtitle2">Plan ahead by reviewing your upcoming tasks</div>
      </q-card-section>
    </q-card>

    <!-- Filters -->
    <q-card class="q-mt-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <q-input
          class="col"
          v-model="filterStart"
          label="Start Date"
          type="date"
          dense
          clearable
        />
        <q-input
          class="col"
          v-model="filterEnd"
          label="End Date"
          type="date"
          dense
          clearable
        />
        <q-select
          class="col"
          v-model="filterPriority"
          :options="['All', 'Low', 'Medium', 'High']"
          label="Priority"
          dense
        />
        <q-btn
          label="Clear Filters"
          color="primary"
          flat
          dense
          @click="clearFilters"
          icon="clear_all"
          class="q-ml-md"
        />
      </q-card-section>
    </q-card>

    <!-- Upcoming Tasks List -->
    <q-card class="shadow-1 q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-sm">Tasks</div>
        <q-list bordered separator>
          <q-item
            v-for="(task, index) in sortedFilteredTasks"
            :key="task.id"
            clickable
            :class="[
              task.done ? 'bg-grey-2' : '',
              isOverdue(task) && !task.done ? 'bg-red-1' : ''
            ]"
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="task.done"
                color="primary"
                @update:model-value="confirmToggleDone(index)"
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
                  v-tooltip="'Cancel Edit'"
                />
              </div>
              <div
                v-else
                class="text-subtitle1"
                :style="{ textDecoration: task.done ? 'line-through' : 'none' }"
                @dblclick="editTask(index)"
                :title="'Double click to edit task text'"
              >
                {{ task.text }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                Due: 
                <span :class="{'text-negative': isOverdue(task) && !task.done}">
                  {{ task.dueDate }}
                </span> |
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

          <q-item v-if="sortedFilteredTasks.length === 0">
            <q-item-section class="text-center text-grey-6">
              No upcoming tasks match your filters.
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Summary Banner -->
    <q-banner
      class="q-mt-md bg-grey-3 text-dark rounded-borders shadow-1"
      dense
    >
      <q-icon name="event" class="q-mr-sm" />
      Total: {{ upcomingTasks.length }} |
      Active: {{ upcomingTasks.filter(t => !t.done).length }} |
      Completed: {{ upcomingTasks.filter(t => t.done).length }}
    </q-banner>

    <!-- Confirm dialog for toggling done -->
    <q-dialog v-model="confirmDialog.visible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm</div>
          <div>Are you sure you want to mark this task as {{ confirmDialog.markDone ? 'done' : 'not done' }}?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Confirm" color="primary" @click="toggleDoneConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const upcomingTasks = ref([
  { id: 1, text: 'Finish project proposal', done: false, dueDate: '2025-06-02', priority: 'High' },
  { id: 2, text: 'Prepare presentation slides', done: false, dueDate: '2025-06-04', priority: 'Medium' },
  { id: 3, text: 'Send follow-up emails', done: true, dueDate: '2025-06-05', priority: 'Low' }
])

const filterStart = ref('')
const filterEnd = ref('')
const filterPriority = ref('All')

const editIndex = ref(null)
const editTaskText = ref('')

const confirmDialog = ref({
  visible: false,
  index: null,
  markDone: null
})

function removeTask(index) {
  if (editIndex.value === index) cancelEdit()
  upcomingTasks.value.splice(index, 1)
}

const filteredTasks = computed(() => {
  return upcomingTasks.value.filter(task => {
    const matchDate =
      (!filterStart.value || task.dueDate >= filterStart.value) &&
      (!filterEnd.value || task.dueDate <= filterEnd.value)
    const matchPriority =
      filterPriority.value === 'All' || task.priority === filterPriority.value
    return matchDate && matchPriority
  })
})

// Sort tasks by dueDate ascending
const sortedFilteredTasks = computed(() => {
  return filteredTasks.value.slice().sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
})

function priorityColor(priority) {
  if (priority === 'High') return 'red'
  if (priority === 'Medium') return 'orange'
  return 'green'
}

function isOverdue(task) {
  if (!task.dueDate || task.done) return false
  const today = new Date()
  const due = new Date(task.dueDate + 'T23:59:59')
  return due < today
}

function editTask(index) {
  editIndex.value = index
  editTaskText.value = upcomingTasks.value[index].text
}

function saveEdit(index) {
  if (editTaskText.value.trim()) {
    upcomingTasks.value[index].text = editTaskText.value.trim()
  }
  editIndex.value = null
  editTaskText.value = ''
}

function cancelEdit() {
  editIndex.value = null
  editTaskText.value = ''
}

function clearFilters() {
  filterStart.value = ''
  filterEnd.value = ''
  filterPriority.value = 'All'
}

function confirmToggleDone(index) {
  confirmDialog.value = {
    visible: true,
    index,
    markDone: !upcomingTasks.value[index].done
  }
}

function toggleDoneConfirmed() {
  const idx = confirmDialog.value.index
  upcomingTasks.value[idx].done = confirmDialog.value.markDone
  confirmDialog.value.visible = false
  confirmDialog.value.index = null
  confirmDialog.value.markDone = null
}
</script>

<style scoped>
.bg-red-1 {
  background-color: #ffcdd2 !important;
  transition: background-color 0.3s ease;
}
</style>