import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import("./App.vue") },
  { path: '/frontend-dev', component: () => import("./views/BackEndInterface.vue") },
  { path: '/tester', component: () => import("./views/ForTester.vue") },
  { path: '/backend-dev', component: () => import("./views/BackEndInterface.vue") },
]


export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

