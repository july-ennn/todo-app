<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" />
        <q-toolbar-title>My Quasar App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Side Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/todo">
          <q-item-section avatar><q-icon name="checklist" /></q-item-section>
          <q-item-section>To-Do</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar><q-icon name="checklist" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>        
      </q-list>
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