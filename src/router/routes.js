const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'todo', component: () => import('pages/ToDoPage.vue') },
      { path: '/tasks/today', component: () => import('pages/TodayTasksPage.vue') },
      { path: '/tasks/upcoming', component: () => import('pages/UpcomingTasksPage.vue') },
      { path: '/tasks/completed', component: () => import('pages/CompletedTasksPage.vue') },
      { path: '/projects/work', component: () => import('pages/WorkProjectsPage.vue') },
      { path: '/projects/personal', component: () => import('pages/PersonalProjectsPage.vue') },
      { path: '/settings/profile', component: () => import('pages/ProfilePage.vue') },
      { path: '/settings/preferences', component: () => import('pages/PreferencesPage.vue') },
      { path: '/tags/work', component: () => import('pages/WorkTagsPage.vue') },
      { path: '/tags/urgent', component: () => import('pages/UrgentTagsPage.vue') },
      { path: '/tags/ideas', component: () => import('pages/IdeasTagsPage.vue') },
      { path: '/calendar', component: () => import('pages/CalendarPage.vue') },
      { path: '/pinned', component: () => import('pages/PinnedTasksPage.vue') },
      { path: '/reminders', component: () => import('pages/RemindersPage.vue') },
      { path: '/focus', component: () => import('pages/FocusModePage.vue') },
      { path: '/notes', component: () => import('pages/NotesPage.vue') },
      { path: '/shared', component: () => import('pages/SharedTasksPage.vue') },
      { path: '/templates', component: () => import('pages/TemplatesPage.vue') },
      { path: '/reports', component: () => import('pages/ReportsPage.vue') },
      { path: '/notifications', component: () => import('pages/NotificationsPage.vue') },
      { path: '/trash', component: () => import('pages/TrashPage.vue') },
      { path: '/help', component: () => import('pages/HelpPage.vue') }
    ]
  },

  // Catch-all for 404s
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes