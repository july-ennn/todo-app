<template>
  <q-page padding class="column">
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-yellow-8 text-black shadow-2 q-mb-md">
      <q-card-section>
        <div class="text-h5">Ideas</div>
        <div class="text-subtitle2">Creative thoughts and notes you want to track and develop.</div>
      </q-card-section>
    </q-card>

    <!-- Search -->
    <q-input
      dense
      debounce="300"
      v-model="searchQuery"
      placeholder="Search ideas..."
      rounded filled clearable
      class="q-mb-md"
      :rules="[val => val !== '']"
    >
      <template #prepend><q-icon name="search" /></template>
    </q-input>

    <q-list bordered separator>
      <q-item v-for="task in filteredIdeas" :key="task.id" clickable>
        <q-item-section class="col">
          <q-item-label :class="{ 'text-line-through': task.reviewed }">{{ task.title }}</q-item-label>

          <q-input
            dense
            v-model="task.note"
            type="textarea"
            placeholder="Add or edit note"
            class="q-mt-xs"
            @click.stop
            autogrow
            square
            outlined
            :readonly="task.reviewed"
          />
        </q-item-section>

        <q-item-section side class="row items-center q-gutter-sm">
          <q-btn
            round dense flat
            icon="check_circle_outline"
            color="green"
            @click.stop="markReviewed(task)"
            v-if="!task.reviewed"
            size="sm"
            v-tooltip="'Mark as reviewed'"
          />
          <q-icon
            name="check_circle"
            color="green"
            v-else
            size="lg"
            class="q-ml-sm"
          />
          <q-btn
            round dense flat
            icon="delete"
            color="negative"
            @click.stop="deleteIdea(task)"
            size="sm"
            v-tooltip="'Delete this idea'"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="filteredIdeas.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No ideas found.</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const tasks = ref([
  { id: 7, title: 'New mobile app concept', tags: ['Ideas'], note: 'Research feasibility', reviewed: false },
  { id: 8, title: 'Improve UX design', tags: ['Ideas'], note: 'Gather user feedback', reviewed: false },
  { id: 9, title: 'Automate reporting', tags: ['Ideas'], note: '', reviewed: false }
])

const searchQuery = ref('')

const ideasTasks = computed(() => tasks.value.filter(t => t.tags.includes('Ideas')))

const filteredIdeas = computed(() => {
  return ideasTasks.value.filter(task =>
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (task.note && task.note.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

function markReviewed(task) {
  task.reviewed = true
}

function deleteIdea(task) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) tasks.value.splice(index, 1)
}
</script>

<style scoped>
.text-line-through {
  text-decoration: line-through;
  color: gray;
}
</style>