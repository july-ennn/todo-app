<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">Completed Tasks</div>
        <div class="text-subtitle2">A record of tasks you've successfully completed</div>
      </q-card-section>
    </q-card>

    <!-- Filter and Search -->
    <q-card class="q-mt-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <q-input
          class="col"
          dense
          v-model="search"
          label="Search task"
          debounce="300"
          clearable
          @clear="search = ''"
        />
        <q-input
          class="col"
          dense
          type="date"
          v-model="filterDateStart"
          label="Start Date"
          clearable
          @clear="filterDateStart = ''"
        />
        <q-input
          class="col"
          dense
          type="date"
          v-model="filterDateEnd"
          label="End Date"
          clearable
          @clear="filterDateEnd = ''"
        />
        <q-btn
          class="col-auto"
          color="primary"
          icon="download"
          label="Export CSV"
          @click="exportCSV"
        />
      </q-card-section>
    </q-card>

    <!-- Completed Tasks List -->
    <q-card class="shadow-1 q-mt-md">
      <q-card-section>
        <q-list bordered separator>
          <q-item
            v-for="(task, index) in sortedFilteredTasks"
            :key="task.id"
            clickable
            class="q-hoverable"
            :class="editIndex === index ? 'bg-grey-1' : ''"
          >
            <q-item-section class="q-pa-none q-pr-md" style="min-width: 60%">
              <div v-if="editIndex === index" class="row items-center">
                <q-input
                  v-model="editTaskText"
                  dense
                  autofocus
                  @keyup.enter="saveEdit(index)"
                  @blur="saveEdit(index)"
                  class="col"
                  counter
                />
                <q-btn
                  flat
                  dense
                  icon="close"
                  color="negative"
                  class="q-ml-sm"
                  @click="cancelEdit"
                  v-tooltip="'Cancel Edit'"
                />
              </div>
              <div
                v-else
                class="text-subtitle1 text-grey-8"
                @dblclick="editTask(index)"
                :title="'Double click to edit task text'"
                style="cursor: pointer;"
              >
                {{ task.text }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                Completed on: {{ task.completedDate }}
              </div>
            </q-item-section>

            <q-item-section side class="q-gutter-sm">
              <q-btn
                flat
                round
                icon="undo"
                color="primary"
                @click="confirmRestore(index)"
                v-tooltip="'Restore task to active list'"
              />
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="confirmRemove(index)"
                v-tooltip="'Delete task permanently'"
              />
            </q-item-section>
          </q-item>

          <q-item v-if="sortedFilteredTasks.length === 0">
            <q-item-section class="text-center text-grey-6 q-pa-lg column flex-center">
              <q-icon name="assignment_turned_in" size="4rem" class="q-mb-md" />
              No tasks found for your filters.
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Summary -->
    <q-banner class="q-mt-md bg-grey-2 text-dark" dense>
      <q-icon name="check_circle" class="q-mr-sm" />
      Total Completed Tasks: {{ completedTasks.length }}
    </q-banner>

    <!-- Confirm Delete Dialog -->
    <q-dialog v-model="confirmDialog.visible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm {{ confirmDialog.type === 'delete' ? 'Delete' : 'Restore' }}</div>
          <div>Are you sure you want to {{ confirmDialog.type }} this task?</div>
          <div class="q-pt-sm text-subtitle2">"<em>{{ confirmDialog.taskText }}</em>"</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Confirm" color="primary" @click="confirmAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { exportFile } from 'quasar'

const completedTasks = ref([
  { id: 1, text: 'Submit monthly report', completedDate: '2025-05-25' },
  { id: 2, text: 'Update client documentation', completedDate: '2025-05-26' },
  { id: 3, text: 'Team meeting preparation', completedDate: '2025-05-27' },
])

const search = ref('')
const filterDateStart = ref('')
const filterDateEnd = ref('')

const editIndex = ref(null)
const editTaskText = ref('')

const confirmDialog = ref({
  visible: false,
  type: '', // 'delete' or 'restore'
  index: null,
  taskText: ''
})

const filteredTasks = computed(() => {
  return completedTasks.value.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(search.value.toLowerCase())
    const matchesDateStart = !filterDateStart.value || task.completedDate >= filterDateStart.value
    const matchesDateEnd = !filterDateEnd.value || task.completedDate <= filterDateEnd.value
    return matchesSearch && matchesDateStart && matchesDateEnd
  })
})

// Sort by completedDate descending (latest first)
const sortedFilteredTasks = computed(() => {
  return filteredTasks.value.slice().sort((a, b) => (a.completedDate < b.completedDate ? 1 : -1))
})

function removeTask(index) {
  completedTasks.value.splice(index, 1)
  cancelEdit()
}

function restoreTask(index) {
  const task = completedTasks.value.splice(index, 1)[0]
  // TODO: push to active tasks list or emit event
  console.log('Restored task:', task)
  cancelEdit()
}

function confirmRemove(index) {
  confirmDialog.value = {
    visible: true,
    type: 'delete',
    index,
    taskText: completedTasks.value[index].text
  }
}

function confirmRestore(index) {
  confirmDialog.value = {
    visible: true,
    type: 'restore',
    index,
    taskText: completedTasks.value[index].text
  }
}

function confirmAction() {
  if (confirmDialog.value.type === 'delete') {
    removeTask(confirmDialog.value.index)
  } else if (confirmDialog.value.type === 'restore') {
    restoreTask(confirmDialog.value.index)
  }
  confirmDialog.value.visible = false
  confirmDialog.value.index = null
  confirmDialog.value.type = ''
  confirmDialog.value.taskText = ''
}

function exportCSV() {
  // Export only filtered tasks
  const content = 'Task,Completed Date\n' + filteredTasks.value
    .map(t => `"${t.text.replace(/"/g, '""')}","${t.completedDate}"`).join('\n')
  exportFile('completed_tasks.csv', content, 'text/csv')
}

// Inline editing functions
function editTask(index) {
  editIndex.value = index
  editTaskText.value = completedTasks.value[index].text
}

function saveEdit(index) {
  if (editTaskText.value.trim()) {
    completedTasks.value[index].text = editTaskText.value.trim()
  }
  cancelEdit()
}

function cancelEdit() {
  editIndex.value = null
  editTaskText.value = ''
}
</script>

<style scoped>
.q-hoverable:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}
</style>