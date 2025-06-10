<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h5">Trash</div>
          <div class="text-subtitle2">Manage your deleted items</div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn icon="restore_page" label="Restore All" flat dense @click="restoreAll" :disable="trashItems.length === 0" />
          <q-btn icon="delete_forever" label="Empty Trash" color="negative" flat dense @click="confirmEmpty" :disable="trashItems.length === 0" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Trash List -->
    <q-list bordered class="q-mt-md">
      <q-item v-for="item in trashItems" :key="item.id" clickable>
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.type }} • Deleted {{ item.deletedAt }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="restore" color="primary" flat dense @click.stop="restoreItem(item.id)" />
          <q-btn icon="delete_forever" color="negative" flat dense @click.stop="deleteItem(item.id)" />
        </q-item-section>
      </q-item>

      <q-item v-if="trashItems.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">Trash is empty</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Confirm Empty Trash Dialog -->
    <q-dialog v-model="confirmingEmpty">
      <q-card>
        <q-card-section class="text-h6">Confirm Empty Trash</q-card-section>
        <q-card-section>Are you sure you want to permanently delete all items in trash?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete All" color="negative" @click="emptyTrash" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const trashItems = ref([
  { id: 1, title: 'Old note', type: 'Note', deletedAt: '2 days ago' },
  { id: 2, title: 'Deleted task', type: 'Task', deletedAt: '5 hours ago' }
])

const confirmingEmpty = ref(false)

function restoreItem(id) {
  trashItems.value = trashItems.value.filter(i => i.id !== id)
  // Add actual restore logic here
}

function deleteItem(id) {
  trashItems.value = trashItems.value.filter(i => i.id !== id)
}

function restoreAll() {
  trashItems.value = []
  // Add actual restore logic here
}

function confirmEmpty() {
  confirmingEmpty.value = true
}

function emptyTrash() {
  trashItems.value = []
  confirmingEmpty.value = false
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>