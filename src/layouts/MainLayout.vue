<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" />
        <q-toolbar-title class="text-weight-bold">My Quasar App</q-toolbar-title>
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

          <!-- Navigation Links -->
          <q-item-label header>Navigation</q-item-label>

          <q-item clickable v-ripple to="/" active-class="text-primary bg-grey-2">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>
          
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

          <q-expansion-item icon="folder" label="Projects" dense expand-separator>
            <q-item clickable v-ripple to="/projects/work" active-class="text-primary bg-grey-2">
              <q-item-section>Work</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/projects/personal" active-class="text-primary bg-grey-2">
              <q-item-section>Personal</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item icon="settings" label="Settings" dense expand-separator>
            <q-item clickable v-ripple to="/settings/profile" active-class="text-primary bg-grey-2">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/settings/preferences" active-class="text-primary bg-grey-2">
              <q-item-section>Preferences</q-item-section>
            </q-item>
          </q-expansion-item>
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
import { ref } from 'vue'
const leftDrawerOpen = ref(false)
</script>