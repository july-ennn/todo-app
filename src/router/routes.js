const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'todo', component: () => import('pages/ToDoPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') }
    ]
  },

  // Catch-all for 404s
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes