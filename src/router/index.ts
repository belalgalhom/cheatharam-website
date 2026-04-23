import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/online',
      name: 'online',
      component: () => import('../views/OnlineView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/player/:id',
      name: 'player-details',
      component: () => import('../views/DetailsView.vue'),
    },
    {
      path: '/screenshots',
      name: 'screenshots',
      component: () => import('../views/ScreenshotsView.vue'),
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../views/DownloadView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const baseTitle = 'CheatHaram - SOF2 Anticheat'

  if (to.name === 'home') {
    document.title = baseTitle
    return
  }

  const titleMap: Record<string, string> = {
    online: 'Online Players',
    search: 'Player Search',
    screenshots: 'Screenshots',
    download: 'Download',
    admin: 'Admin Control Panel',
  }

  const pageName = to.name as string
  if (titleMap[pageName]) {
    document.title = `${titleMap[pageName]} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
})

export default router
