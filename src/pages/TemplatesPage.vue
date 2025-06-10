<!-- src/pages/Templates.vue -->
<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section>
        <div class="text-h5">Templates</div>
        <div class="text-subtitle2">Manage reusable templates</div>
      </q-card-section>
    </q-card>

    <!-- Search and Add -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <q-input
        dense
        debounce="300"
        v-model="searchQuery"
        placeholder="Search templates..."
        rounded
        filled
        clearable
        class="col-8 col-sm-6 col-md-4"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-btn
        dense
        icon="add"
        label="Add Template"
        color="primary"
        class="col-auto"
        @click="openDialog(true)"
      />
    </div>

    <!-- Template List -->
    <q-list bordered separator>
      <q-item v-for="template in filteredTemplates" :key="template.id" clickable>
        <q-item-section>
          <q-item-label>{{ template.name }}</q-item-label>
          <q-item-label caption>{{ template.description }}</q-item-label>
        </q-item-section>
        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round dense flat icon="edit"
            color="primary"
            @click.stop="editTemplate(template)"
            v-tooltip="'Edit template'"
            size="sm"
          />
          <q-btn
            round dense flat icon="delete"
            color="negative"
            @click.stop="confirmDelete(template.id)"
            v-tooltip="'Delete template'"
            size="sm"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredTemplates.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No templates found.</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add/Edit Template Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section>
          <q-input v-model="templateForm.name" label="Template Name" autofocus />
          <q-input
            v-model="templateForm.description"
            label="Description"
            type="textarea"
            class="q-mt-md"
            autogrow
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="dialogOpen = false" />
          <q-btn flat label="Save" @click="saveTemplate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmOpen" persistent>
      <q-card>
        <q-card-section class="text-h6">
          Are you sure you want to delete this template?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="deleteConfirmOpen = false" />
          <q-btn flat label="Delete" color="negative" @click="deleteTemplate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const templates = ref([
  { id: 1, name: 'Bug Report', description: 'Template for reporting bugs' },
  { id: 2, name: 'Meeting Notes', description: 'Template for meeting summaries' }
])

const searchQuery = ref('')
const dialogOpen = ref(false)
const deleteConfirmOpen = ref(false)
const templateForm = ref({ id: null, name: '', description: '' })
let deleteTemplateId = null

const filteredTemplates = computed(() => {
  if (!searchQuery.value) return templates.value
  return templates.value.filter(t =>
    t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openDialog(isNew = true) {
  if (isNew) {
    templateForm.value = { id: null, name: '', description: '' }
  }
  dialogOpen.value = true
}

function editTemplate(template) {
  templateForm.value = { ...template }
  dialogOpen.value = true
}

function saveTemplate() {
  if (!templateForm.value.name.trim()) return
  if (templateForm.value.id) {
    const index = templates.value.findIndex(t => t.id === templateForm.value.id)
    if (index !== -1) templates.value[index] = { ...templateForm.value }
  } else {
    templates.value.push({ ...templateForm.value, id: Date.now() })
  }
  dialogOpen.value = false
}

function confirmDelete(id) {
  deleteTemplateId = id
  deleteConfirmOpen.value = true
}

function deleteTemplate() {
  templates.value = templates.value.filter(t => t.id !== deleteTemplateId)
  deleteConfirmOpen.value = false
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>