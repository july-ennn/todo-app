<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Welcome Card -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 row items-center q-mb-md">
      <q-avatar size="56px" rounded>
        <img src="https://cdn.quasar.dev/img/avatar.png" alt="User avatar" />
      </q-avatar>
      <div class="q-ml-md">
        <div class="text-h5">Welcome back, {{ userName }}!</div>
        <div class="text-subtitle2">Your productivity at a glance</div>
      </div>
      <q-btn
        round
        dense
        icon="refresh"
        flat
        color="white"
        class="q-ml-auto"
        :loading="loading"
        @click="refreshStats"
        v-tooltip="'Refresh statistics'"
      />
    </q-card>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-4">
        <q-card class="bg-indigo-2 text-indigo-10 shadow-1">
          <q-card-section>
            <div class="text-h6">Tasks Today</div>
            <div class="text-h3 q-mt-sm">{{ stats.todayTasks }}</div>
            <q-linear-progress
              :value="Math.min(stats.todayTasks / 10, 1)"
              color="indigo"
              class="q-mt-sm"
              animated
              buffer-value="1"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="bg-green-2 text-green-10 shadow-1">
          <q-card-section>
            <div class="text-h6">Completed Tasks</div>
            <div class="text-h3 q-mt-sm">{{ stats.completedTasks }}</div>
            <q-linear-progress
              :value="Math.min(stats.completedTasks / 20, 1)"
              color="green"
              class="q-mt-sm"
              animated
              buffer-value="1"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="bg-orange-2 text-orange-10 shadow-1">
          <q-card-section>
            <div class="text-h6">Active Projects</div>
            <div class="text-h3 q-mt-sm">{{ stats.activeProjects }}</div>
            <q-linear-progress
              :value="Math.min(stats.activeProjects / 5, 1)"
              color="orange"
              class="q-mt-sm"
              animated
              buffer-value="1"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <q-card class="shadow-1 q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Quick Actions</div>
        <div class="row q-col-gutter-sm q-gutter-y-sm">
          <q-btn
            class="col"
            icon="add"
            label="New Task"
            color="primary"
            unelevated
            @click="goTo('tasks/today')"
            v-tooltip="'Add a new task for today'"
          />
          <q-btn
            class="col"
            icon="event"
            label="Upcoming"
            color="orange"
            unelevated
            @click="goTo('tasks/upcoming')"
            v-tooltip="'View your upcoming tasks and deadlines'"
          />
          <q-btn
            class="col"
            icon="check_circle"
            label="Completed"
            color="green"
            unelevated
            @click="goTo('projects/work')"
            v-tooltip="'See your completed tasks history'"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Recent Activity -->
    <q-card class="shadow-1">
      <q-card-section>
        <div class="text-h6">Recent Activity</div>
        <q-list dense bordered separator class="q-mt-sm">
          <q-item v-for="(log, index) in activityLog" :key="index">
            <q-item-section>
              <div>{{ log.text }}</div>
              <div class="text-caption text-grey-6 q-mt-xs">{{ formatDate(log.date) }}</div>
            </q-item-section>
            <q-item-section side top class="q-pa-none">
              <q-icon :name="log.icon" :color="log.color" size="24px" />
            </q-item-section>
          </q-item>
          <q-item v-if="activityLog.length === 0">
            <q-item-section class="text-center text-grey-6">No recent activity.</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

const router = useRouter()
const loading = ref(false)
const userName = ref('User')

const stats = ref({
  todayTasks: 5,
  completedTasks: 12,
  activeProjects: 3
})

const activityLog = ref([
  { text: 'Completed "Team Meeting"', icon: 'check_circle', color: 'green', date: '2025-05-27T15:30:00' },
  { text: 'Added new task: "Plan Sprint Review"', icon: 'add_task', color: 'blue', date: '2025-05-26T10:00:00' },
  { text: 'Marked "Write Documentation" as done', icon: 'done_all', color: 'green', date: '2025-05-25T17:45:00' }
])

function goTo(page) {
  router.push(`/${page}`)
}

function formatDate(iso) {
  return date.formatDate(iso, 'MMM D, YYYY hh:mm A')
}

async function refreshStats() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:8000/api/dashboard-stats')
    const data = await res.json()
    stats.value = data

    activityLog.value.unshift({
      text: 'Fetched dashboard stats from backend',
      icon: 'cloud_download',
      color: 'blue',
      date: new Date().toISOString()
    })
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  } finally {
    loading.value = false
  }
}
</script>