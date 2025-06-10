<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" />
        <q-toolbar-title class="text-weight-bold">TaskFlow</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Side Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding>

          <!-- App Logo / Name -->
          <q-item>
            <q-item-section avatar>
              <q-avatar icon="check_circle" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">TaskApp</q-item-label>
              <q-item-label caption>Manage efficiently</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- Search -->
          <q-input
            dense debounce="300"
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="q-ma-sm"
            rounded
            filled
            clearable
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>

          <!-- Navigation Links -->
          <q-item-label header>Navigation</q-item-label>

          <q-item clickable v-ripple to="/" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <!-- Pinned Tasks -->
          <q-item clickable v-ripple to="/pinned" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="star" /></q-item-section>
            <q-item-section>Pinned</q-item-section>
          </q-item>

          <!-- Tasks -->
          <q-expansion-item icon="task_alt" label="Tasks" dense expand-separator>
            <q-item clickable v-ripple to="/tasks/today" active-class="text-primary bg-grey-2">
              <q-item-section>Today</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tasks/upcoming" active-class="text-primary bg-grey-2">
              <q-item-section>Upcoming</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tasks/completed" active-class="text-primary bg-grey-2">
              <q-item-section>Completed</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- Projects -->
          <q-expansion-item icon="folder" label="Projects" dense expand-separator>
            <q-item clickable v-ripple to="/projects/work" active-class="text-primary bg-grey-2">
              <q-item-section>Work</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/projects/personal" active-class="text-primary bg-grey-2">
              <q-item-section>Personal</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- Tags -->
          <q-expansion-item icon="label" label="Tags" dense expand-separator>
            <q-item clickable v-ripple to="/tags/work" active-class="text-primary bg-grey-2">
              <q-item-section>Work</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tags/urgent" active-class="text-primary bg-grey-2">
              <q-item-section>Urgent</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tags/ideas" active-class="text-primary bg-grey-2">
              <q-item-section>Ideas</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- Calendar View -->
          <q-item clickable v-ripple to="/calendar" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="event" /></q-item-section>
            <q-item-section>Calendar</q-item-section>
          </q-item>

          <!-- Productivity Tools -->
          <q-item-label header>Productivity Tools</q-item-label>

          <q-item clickable v-ripple to="/reminders" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="alarm" /></q-item-section>
            <q-item-section>Reminders</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/focus" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="hourglass_top" /></q-item-section>
            <q-item-section>Focus Mode</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/notes" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="sticky_note_2" /></q-item-section>
            <q-item-section>Notes</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/shared" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Shared Tasks</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/templates" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="layers" /></q-item-section>
            <q-item-section>Templates</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/reports" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="bar_chart" /></q-item-section>
            <q-item-section>Reports</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/notifications" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="notifications" /></q-item-section>
            <q-item-section>Notifications</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/trash" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="delete" /></q-item-section>
            <q-item-section>Trash</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/help" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="help_outline" /></q-item-section>
            <q-item-section>Help</q-item-section>
          </q-item>

          <!-- Settings -->
          <q-expansion-item icon="settings" label="Settings" dense expand-separator>
            <q-item clickable v-ripple to="/settings/profile" active-class="text-primary bg-grey-2">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/settings/preferences" active-class="text-primary bg-grey-2">
              <q-item-section>Preferences</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator spaced />

          <!-- User Profile and Logout -->
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://placehold.co/50x50" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>John Doe</q-item-label>
              <q-item-label caption>Logout</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'

const leftDrawerOpen = ref(false)
const searchQuery = ref('')

watch(searchQuery, (val) => {
  console.log('Searching for:', val)
})
</script>