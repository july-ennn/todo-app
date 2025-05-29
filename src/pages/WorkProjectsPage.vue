<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle with Add Button -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 row items-center justify-between">
      <div>
        <div class="text-h5">Work Projects</div>
        <div class="text-subtitle2">Manage and track your work-related projects</div>
      </div>
      <q-btn icon="add" label="Add Project" color="white" flat @click="showAddDialog = true" />
    </q-card>

    <!-- Filters -->
    <q-card class="q-mt-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <q-input
          class="col"
          v-model="search"
          dense
          label="Search project"
          clearable
          @clear="search = ''"
          debounce="300"
        />
        <q-select
          class="col"
          v-model="statusFilter"
          :options="['All', 'Pending', 'In Progress', 'Completed']"
          dense
          label="Filter by status"
          emit-value
          map-options
        />
        <q-btn flat color="primary" label="Sort by Due Date" icon="sort" @click="toggleSort" />
      </q-card-section>
    </q-card>

    <!-- Project List -->
    <q-card
      v-for="(project, index) in sortedFilteredProjects"
      :key="index"
      class="q-mt-md shadow-2"
    >
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="text-h6">{{ project.title }}</div>
            <div class="text-body2 text-grey-8">{{ project.description }}</div>
            <div class="q-mt-xs">
              <q-chip :color="chipColor(project.status)" text-color="white">{{ project.status }}</q-chip>
              <q-chip class="q-ml-sm" color="grey-4" text-color="black" dense>
                Due: {{ project.dueDate || 'N/A' }}
              </q-chip>
            </div>
          </div>
          <div style="width: 180px; min-width: 180px;">
            <q-tooltip anchor="top middle">
              Progress: {{ project.progress }}%
            </q-tooltip>
            <q-linear-progress :value="project.progress / 100" color="primary" />
            <div class="text-caption text-right q-mt-xs">{{ project.progress }}%</div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-gutter-sm">
        <q-btn flat icon="edit" label="Edit" color="primary" @click="editProject(index)" />
        <q-btn flat icon="visibility" label="View" color="primary" @click="viewProject(project)" />
        <q-btn flat icon="delete" label="Remove" color="negative" @click="confirmRemove(index)" />
      </q-card-actions>
    </q-card>

    <!-- Empty State -->
    <div v-if="sortedFilteredProjects.length === 0" class="text-center text-grey q-mt-md">
      No matching work projects found.
    </div>

    <!-- Project Details Modal -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ selectedProject.title }}</div>
          <div class="text-body2 q-mt-sm">{{ selectedProject.description }}</div>
          <q-chip class="q-mt-sm" :color="chipColor(selectedProject.status)" text-color="white">
            {{ selectedProject.status }}
          </q-chip>
          <q-chip class="q-ml-sm q-mt-sm" color="grey-4" text-color="black" dense>
            Due: {{ selectedProject.dueDate || 'N/A' }}
          </q-chip>
          <q-linear-progress
            class="q-mt-sm"
            :value="selectedProject.progress / 100"
            color="primary"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add / Edit Project Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</div>
          <q-input v-model="form.title" label="Title" dense autofocus />
          <q-input v-model="form.description" label="Description" type="textarea" dense class="q-mt-sm" />
          <q-select
            v-model="form.status"
            :options="['Pending', 'In Progress', 'Completed']"
            label="Status"
            dense
            class="q-mt-sm"
          />
          <q-input
            v-model="form.progress"
            label="Progress (%)"
            type="number"
            min="0"
            max="100"
            dense
            class="q-mt-sm"
          />
          <q-input
            v-model="form.dueDate"
            label="Due Date"
            type="date"
            dense
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetForm" />
          <q-btn flat label="Save" color="primary" @click="saveProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Remove Dialog -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6">Confirm Removal</div>
          <div>Are you sure you want to remove this project?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Remove" color="negative" @click="removeConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const workProjects = ref([
  {
    title: 'Client Website Redesign',
    description: 'Revamping the user interface and experience for the client portal.',
    status: 'In Progress',
    progress: 60,
    dueDate: '2025-06-15'
  },
  {
    title: 'API Integration for Payroll',
    description: 'Integrate external payroll system for automated calculations.',
    status: 'Pending',
    progress: 10,
    dueDate: '2025-07-01'
  },
  {
    title: 'Internal Tool Migration',
    description: 'Migrate legacy tools to new platform with improved features.',
    status: 'Completed',
    progress: 100,
    dueDate: '2025-05-30'
  }
])

const search = ref('')
const statusFilter = ref('All')
const dialog = ref(false)
const selectedProject = ref({})

const showAddDialog = ref(false)
const confirmDialog = ref(false)
const isEditing = ref(false)
const editIndex = ref(-1)
const removeIndex = ref(-1)

const form = ref({
  title: '',
  description: '',
  status: 'Pending',
  progress: 0,
  dueDate: ''
})

function chipColor(status) {
  return {
    'Pending': 'orange',
    'In Progress': 'blue',
    'Completed': 'green'
  }[status] || 'grey'
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    status: 'Pending',
    progress: 0,
    dueDate: ''
  }
  isEditing.value = false
  editIndex.value = -1
}

function saveProject() {
  if (!form.value.title.trim()) {
    alert('Title is required.')
    return
  }
  if (form.value.progress < 0 || form.value.progress > 100) {
    alert('Progress must be between 0 and 100.')
    return
  }
  if (isEditing.value) {
    workProjects.value[editIndex.value] = { ...form.value }
  } else {
    workProjects.value.push({ ...form.value })
  }
  showAddDialog.value = false
  resetForm()
}

function editProject(index) {
  isEditing.value = true
  editIndex.value = index
  form.value = { ...workProjects.value[index] }
  showAddDialog.value = true
}

function viewProject(project) {
  selectedProject.value = project
  dialog.value = true
}

function confirmRemove(index) {
  removeIndex.value = index
  confirmDialog.value = true
}

function removeConfirmed() {
  workProjects.value.splice(removeIndex.value, 1)
  confirmDialog.value = false
  removeIndex.value = -1
}

const filteredProjects = computed(() => {
  return workProjects.value.filter(project => {
    const matchSearch = project.title.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = statusFilter.value === 'All' || project.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const sortAsc = ref(true)
function toggleSort() {
  sortAsc.value = !sortAsc.value
}

const sortedFilteredProjects = computed(() => {
  return filteredProjects.value.slice().sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return sortAsc.value
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
  })
})
</script>