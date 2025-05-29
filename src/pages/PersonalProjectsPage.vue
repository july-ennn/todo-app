<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">Personal Projects</div>
        <div class="text-subtitle2">Organize your personal goals and tasks</div>
      </q-card-section>
    </q-card>

    <!-- Controls: Search, Filter, Sort, Add -->
    <q-card class="q-mt-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <q-input
          v-model="search"
          label="Search personal projects"
          dense
          class="col"
          clearable
          debounce="300"
        />
        <q-select
          v-model="statusFilter"
          :options="['All', 'Pending', 'In Progress', 'Completed']"
          label="Filter by status"
          dense
          class="col"
          emit-value
          map-options
        />
        <q-select
          v-model="sortBy"
          :options="[
            { label: 'Sort by Due Date', value: 'dueDate' },
            { label: 'Sort by Progress', value: 'progress' }
          ]"
          label="Sort projects"
          dense
          class="col"
          emit-value
          map-options
        />
        <q-btn
          color="primary"
          icon="add"
          label="Add Project"
          class="q-ml-md"
          @click="showAddDialog = true"
        />
      </q-card-section>
    </q-card>

    <!-- Status Summary -->
    <div class="row justify-around q-my-md">
      <q-chip
        v-for="status in ['Pending', 'In Progress', 'Completed']"
        :key="status"
        :color="getStatusColor(status)"
        text-color="white"
        outline
        class="q-px-md"
      >
        {{ status }}: {{ countByStatus(status) }}
      </q-chip>
    </div>

    <!-- Project List -->
    <q-card
      v-for="(project, index) in sortedFilteredProjects"
      :key="index"
      class="q-mt-md shadow-2 hoverable"
      style="transition: box-shadow 0.3s;"
      :class="{ 'shadow-8': hoverIndex === index }"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = null"
    >
      <q-card-section>
        <div class="row justify-between items-center">
          <div style="max-width: 65%">
            <div class="text-h6">{{ project.title }}</div>
            <div class="text-body2 text-grey-8 q-mt-xs">{{ project.description }}</div>
            <div class="row items-center q-mt-xs">
              <q-chip
                :color="getStatusColor(project.status)"
                text-color="white"
                class="q-mr-sm"
                outline
                dense
              >
                {{ project.status }}
              </q-chip>
              <q-icon name="event" size="16" class="q-mr-xs" />
              <div class="text-caption text-grey-6">{{ formatDate(project.dueDate) || 'No due date' }}</div>
            </div>
          </div>
          <div style="width: 170px;">
            <q-linear-progress :value="project.progress / 100" color="primary" />
            <div class="text-caption text-right q-mt-xs">{{ project.progress }}%</div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          icon="visibility"
          label="View"
          color="primary"
          @click="viewProject(project)"
        />
        <q-btn
          flat
          icon="delete"
          label="Remove"
          color="negative"
          @click="confirmRemove(index)"
        />
      </q-card-actions>
    </q-card>

    <!-- Empty State -->
    <div
      v-if="sortedFilteredProjects.length === 0"
      class="text-center text-grey q-mt-md"
    >
      No personal projects found.
    </div>

    <!-- Project Details Dialog with Editable Status and Progress -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6 q-mb-sm">{{ selectedProject.title }}</div>
          <div class="text-body2 q-mb-md">{{ selectedProject.description }}</div>

          <q-input
            dense
            v-model.number="selectedProject.progress"
            type="number"
            label="Progress (%)"
            min="0"
            max="100"
          />

          <q-select
            dense
            v-model="selectedProject.status"
            :options="['Pending', 'In Progress', 'Completed']"
            label="Status"
            class="q-mt-md"
          />

          <q-input
            dense
            v-model="selectedProject.dueDate"
            label="Due Date"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            class="q-mt-md"
          />

          <q-linear-progress
            class="q-mt-lg"
            :value="selectedProject.progress / 100"
            color="primary"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Remove Confirmation Dialog -->
    <q-dialog v-model="confirmDialog">
      <q-card style="min-width: 300px">
        <q-card-section class="text-center">
          <div class="text-h6">Confirm Removal</div>
          <div class="q-mt-md">Are you sure you want to remove this project?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Remove" color="negative" @click="removeConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Project Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6 q-mb-md">Add New Project</div>
          <q-input
            v-model="newProject.title"
            label="Title"
            dense
            :rules="[val => !!val || 'Title is required']"
          />
          <q-input
            v-model="newProject.description"
            label="Description"
            dense
            type="textarea"
            class="q-mt-md"
          />
          <q-select
            v-model="newProject.status"
            :options="['Pending', 'In Progress', 'Completed']"
            label="Status"
            dense
            class="q-mt-md"
          />
          <q-input
            v-model.number="newProject.progress"
            label="Progress (%)"
            type="number"
            min="0"
            max="100"
            dense
            class="q-mt-md"
          />
          <q-input
            v-model="newProject.dueDate"
            label="Due Date"
            placeholder="YYYY-MM-DD"
            mask="####-##-##"
            dense
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetNewProject" />
          <q-btn flat label="Add" color="primary" @click="addProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const personalProjects = ref([
  {
    title: 'Fitness Tracker App',
    description: 'Build a simple app to log daily workouts and meals.',
    status: 'In Progress',
    progress: 50,
    dueDate: '2025-06-10',
  },
  {
    title: 'Travel Blog Website',
    description: 'Create a blog to document my travel adventures.',
    status: 'Pending',
    progress: 0,
    dueDate: '2025-08-01',
  },
  {
    title: 'Home Budget Planner',
    description: 'Develop a tool to track and manage monthly expenses.',
    status: 'Completed',
    progress: 100,
    dueDate: '2025-04-20',
  },
])

const search = ref('')
const statusFilter = ref('All')
const sortBy = ref('dueDate') // default sorting
const dialog = ref(false)
const selectedProject = ref({})
const confirmDialog = ref(false)
const removeIndex = ref(null)
const showAddDialog = ref(false)

const newProject = ref({
  title: '',
  description: '',
  status: 'Pending',
  progress: 0,
  dueDate: '',
})

function getStatusColor(status) {
  switch (status) {
    case 'In Progress': return 'primary'
    case 'Pending': return 'orange'
    case 'Completed': return 'green'
    default: return 'grey'
  }
}

function viewProject(project) {
  selectedProject.value = { ...project } // copy for editing
  dialog.value = true
}

function confirmRemove(index) {
  removeIndex.value = index
  confirmDialog.value = true
}

function removeConfirmed() {
  if (removeIndex.value !== null) {
    personalProjects.value.splice(removeIndex.value, 1)
    removeIndex.value = null
  }
  confirmDialog.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function countByStatus(status) {
  return personalProjects.value.filter(p => p.status === status).length
}

const filteredProjects = computed(() => {
  return personalProjects.value.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'All' || project.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const sortedFilteredProjects = computed(() => {
  let sorted = [...filteredProjects.value]
  if (sortBy.value === 'dueDate') {
    sorted.sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  } else if (sortBy.value === 'progress') {
    sorted.sort((a, b) => b.progress - a.progress)
  }
  return sorted
})

// Add new project with validation
function addProject() {
  if (!newProject.value.title.trim()) {
    // You can improve this by showing validation feedback on UI
    alert('Title is required')
    return
  }
  personalProjects.value.push({ ...newProject.value })
  resetNewProject()
  showAddDialog.value = false
}

function resetNewProject() {
  newProject.value = {
    title: '',
    description: '',
    status: 'Pending',
    progress: 0,
    dueDate: '',
  }
}

let hoverIndex = ref(null)
</script>

<style scoped>
.hoverable:hover {
  cursor: pointer;
}
</style>