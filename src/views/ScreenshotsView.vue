<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Camera,
  User,
  Hash,
  Maximize2,
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Globe,
} from 'lucide-vue-next'
import { api } from '@/utils/api'

const route = useRoute()
const filterGuid = computed(() => route.query.guid as string | undefined)
const filterName = computed(() => route.query.name as string | undefined)

const screenshots = ref<any[]>([])

const fetchScreenshots = async () => {
  if (filterGuid.value) {
    try {
      const searchRes = await api.get(`/clients/search?guid=${filterGuid.value}`)
      if (searchRes.ok) {
        const users = await searchRes.json()
        if (users.length > 0) {
          const ssRes = await api.get(`/players/${users[0].id}/fairshots`)
          if (ssRes.ok) {
            const data = await ssRes.json()
            const rawScreenshots = Array.isArray(data)
              ? data
              : data.fairshots || data.screenshots || []
            screenshots.value = rawScreenshots.map((s: any, i: number) => ({
              id: i,
              player: filterName.value || filterGuid.value,
              guid: filterGuid.value,
              date: new Date(s.createdAt).toLocaleString(),
              url: s.imageUrl,
              server: s.server_ip || s.server || 'Unknown Server',
            }))
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      const ssRes = await api.get('/fairshots')
      if (ssRes.ok) {
        const data = await ssRes.json()
        const rawScreenshots = Array.isArray(data) ? data : data.fairshots || data.screenshots || []
        screenshots.value = rawScreenshots.map((s: any, i: number) => ({
          id: i,
          player: s.player_name || 'UnnamedPlayer',
          guid: s.active_guid || 'N/A',
          date: new Date(s.createdAt).toLocaleString(),
          url: s.imageUrl,
          // Fix: Mapping both 'server_ip' and 'server'
          server: s.server_ip || s.server || 'Unknown Server',
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }
}

// Simplified download using the direct link
const downloadImage = (url: string) => {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.download = '' // Note: Browser cross-origin policies may still open in new tab
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchScreenshots()
})

const selectedIndex = ref<number | null>(null)
const isZoomed = ref(false)

const openLightbox = (index: number) => {
  selectedIndex.value = index
  isZoomed.value = false
}

const closeLightbox = () => {
  selectedIndex.value = null
  isZoomed.value = false
}

const nextImage = (e: Event) => {
  e.stopPropagation()
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value + 1) % screenshots.value.length
    isZoomed.value = false
  }
}

const prevImage = (e: Event) => {
  e.stopPropagation()
  if (selectedIndex.value !== null) {
    selectedIndex.value =
      (selectedIndex.value - 1 + screenshots.value.length) % screenshots.value.length
    isZoomed.value = false
  }
}

const toggleZoom = (e: Event) => {
  e.stopPropagation()
  isZoomed.value = !isZoomed.value
}
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold mb-2">
          {{ filterGuid ? 'Player Gallery' : 'Fairshots' }}
        </h1>
        <p class="text-slate-400 text-sm md:text-base">
          {{
            filterGuid
              ? `${screenshots.length} screenshot(s) found.`
              : 'Automated captures from protected game sessions.'
          }}
        </p>
      </div>
    </div>

    <div
      v-if="screenshots.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      <div
        v-for="(ss, index) in screenshots"
        :key="ss.id"
        class="group relative bg-slate-800/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-all"
      >
        <div class="relative aspect-video overflow-hidden border-b border-white/5">
          <img
            :src="ss.url"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
          >
            <button
              @click="openLightbox(index)"
              class="p-4 bg-amber-500 text-black rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <Maximize2 class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-amber-500"
            >
              <User class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold">{{ ss.player }}</h3>
              <div class="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <Hash class="w-3 h-3" /> {{ ss.guid }}
              </div>
            </div>
          </div>

          <div
            class="flex items-center gap-2 mb-4 text-[10px] text-emerald-500 uppercase font-black"
          >
            <Globe class="w-3 h-3" /> {{ ss.server }}
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">{{
              ss.date
            }}</span>
            <button
              @click="downloadImage(ss.url)"
              class="text-slate-400 hover:text-white transition-colors"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="selectedIndex !== null"
        @click="closeLightbox"
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
      >
        <div class="fixed top-8 right-8 flex items-center gap-4 z-[110]">
          <button
            @click.stop="downloadImage(screenshots[selectedIndex!]?.url)"
            class="p-3 bg-white/10 text-white rounded-xl hover:bg-amber-500 transition-colors"
          >
            <Download class="w-6 h-6" />
          </button>
          <button
            @click="closeLightbox"
            class="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500 transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="w-full h-full flex flex-col items-center justify-center">
          <img
            :src="screenshots[selectedIndex!]?.url"
            class="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
          />

          <div
            v-if="!isZoomed"
            @click.stop
            class="mt-6 flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white"
          >
            <span class="font-bold">{{ screenshots[selectedIndex!]?.player }}</span>
            <span class="text-slate-400 text-xs border-l border-white/20 pl-4">{{
              screenshots[selectedIndex!]?.guid
            }}</span>
            <span class="text-emerald-400 text-xs font-black border-l border-white/20 pl-4">{{
              screenshots[selectedIndex!]?.server
            }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
