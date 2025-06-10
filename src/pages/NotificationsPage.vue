<template>
  <q-page padding>
    <!-- Header Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 q-mb-md rounded-borders">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h5">Notifications</div>
          <div class="text-subtitle2">Stay updated with latest alerts</div>
        </div>
        <q-btn
          icon="delete_forever"
          color="negative"
          flat
          dense
          :disable="notifications.length === 0"
          @click="clearNotifications"
          label="Clear All"
          class="q-ml-md"
        />
      </q-card-section>
    </q-card>

    <!-- Notification List -->
    <q-list bordered class="q-mt-md">
      <q-item
        v-for="notif in notifications"
        :key="notif.id"
        clickable
        :class="{'bg-grey-2': !notif.read}"
        @click="toggleRead(notif)"
      >
        <q-item-section>
          <q-item-label :class="{'text-weight-bold': !notif.read}">{{ notif.message }}</q-item-label>
          <q-item-label caption>{{ notif.time }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="delete"
            color="negative"
            flat
            dense
            @click.stop="deleteNotification(notif.id)"
            :aria-label="'Delete notification: ' + notif.message"
          />
          <q-btn
            icon="done"
            color="positive"
            flat
            dense
            v-if="!notif.read"
            @click.stop="markAsRead(notif)"
            :aria-label="'Mark notification as read: ' + notif.message"
          />
          <q-icon v-else name="done_all" color="green" />
        </q-item-section>
      </q-item>

      <q-item v-if="notifications.length === 0" class="justify-center">
        <q-item-section>
          <div class="text-center text-grey-6">No notifications</div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Unread count -->
    <div v-if="unreadCount > 0" class="q-mt-md text-caption text-primary">
      You have {{ unreadCount }} unread notification{{ unreadCount > 1 ? 's' : '' }}.
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const notifications = ref([
  { id: 1, message: 'New task assigned', time: '10 minutes ago', read: false },
  { id: 2, message: 'Meeting at 3 PM', time: '1 hour ago', read: true }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function clearNotifications() {
  notifications.value = []
}

function deleteNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function markAsRead(notif) {
  notif.read = true
}

function toggleRead(notif) {
  notif.read = !notif.read
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>