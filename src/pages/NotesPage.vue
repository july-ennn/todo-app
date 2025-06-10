<!-- src/pages/Notes.vue -->
<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section>
        <div class="text-h5">Notes</div>
        <div class="text-subtitle2">Manage your notes effectively</div>
      </q-card-section>
    </q-card>

    <!-- Search and Add -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <q-input
        dense
        debounce="300"
        v-model="searchQuery"
        placeholder="Search notes..."
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
        label="Add Note"
        color="primary"
        class="col-auto"
        @click="openDialog(true)"
      />
    </div>

    <!-- Notes List -->
    <q-list bordered separator>
      <q-item v-for="note in filteredNotes" :key="note.id" clickable @click="openDialog(false, note)">
        <q-item-section>
          <q-item-label>{{ note.title }}</q-item-label>
          <q-item-label caption>{{ note.content }}</q-item-label>
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round
            dense
            flat
            icon="edit"
            color="primary"
            @click.stop="openDialog(false, note)"
            v-tooltip="'Edit note'"
            size="sm"
          />
          <q-btn
            round
            dense
            flat
            icon="delete"
            color="negative"
            @click.stop="confirmDelete(note.id)"
            v-tooltip="'Delete note'"
            size="sm"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredNotes.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No notes found.</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section>
          <q-input v-model="currentNote.title" label="Title" autofocus />
          <q-input
            v-model="currentNote.content"
            label="Content"
            type="textarea"
            autogrow
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="dialogOpen = false" />
          <q-btn flat label="Save" @click="saveNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmOpen" persistent>
      <q-card>
        <q-card-section class="text-h6">
          Are you sure you want to delete this note?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="deleteConfirmOpen = false" />
          <q-btn flat label="Delete" color="negative" @click="deleteNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const notes = ref([
  { id: 1, title: 'Shopping List', content: 'Milk, Bread, Eggs' },
  { id: 2, title: 'Meeting Notes', content: 'Discuss project timeline' }
])

const searchQuery = ref('')
const dialogOpen = ref(false)
const deleteConfirmOpen = ref(false)

const currentNote = ref({ id: null, title: '', content: '' })
let deleteNoteId = null

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  return notes.value.filter(n =>
    n.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openDialog(isNew = true, note = null) {
  if (isNew) {
    currentNote.value = { id: null, title: '', content: '' }
  } else if (note) {
    currentNote.value = { ...note }
  }
  dialogOpen.value = true
}

function saveNote() {
  if (!currentNote.value.title || !currentNote.value.content) {
    return
  }
  if (currentNote.value.id) {
    // Update existing note
    const index = notes.value.findIndex(n => n.id === currentNote.value.id)
    if (index !== -1) {
      notes.value[index] = { ...currentNote.value }
    }
  } else {
    // Add new note
    notes.value.push({
      id: Date.now(),
      title: currentNote.value.title,
      content: currentNote.value.content
    })
  }
  dialogOpen.value = false
}

function confirmDelete(id) {
  deleteNoteId = id
  deleteConfirmOpen.value = true
}

function deleteNote() {
  notes.value = notes.value.filter(n => n.id !== deleteNoteId)
  deleteConfirmOpen.value = false
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>