<script setup lang="ts">
import { ref, computed } from 'vue'
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
} from 'lucide-vue-next'

const route = useRoute()
const filterGuid = computed(() => route.query.guid as string | undefined)
const filterName = computed(() => route.query.name as string | undefined)

import { api } from '@/utils/api'

const screenshots = ref<any[]>([])

import { onMounted } from 'vue'

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
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }
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
    <!-- Filter Banner -->
    <div
      v-if="filterGuid"
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl gap-4"
    >
      <div class="flex flex-wrap items-center gap-3">
        <Camera class="w-5 h-5 text-amber-500" />
        <span class="text-amber-400 font-bold text-sm md:text-base"
          >Results for: <span class="text-white">{{ filterName || filterGuid }}</span></span
        >
        <code class="text-[10px] text-slate-400 font-mono bg-black/30 px-2 py-1 rounded">{{
          filterGuid
        }}</code>
      </div>
      <RouterLink
        to="/screenshots"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-bold"
      >
        <ArrowLeft class="w-4 h-4" />
        Clear Filter
      </RouterLink>
    </div>

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
      <div
        v-if="!filterGuid"
        class="hidden md:flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20"
      >
        <Camera class="w-5 h-5" />
        <span class="font-bold text-sm tracking-widest uppercase">Live Submissions</span>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div
      v-if="screenshots.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      <div
        v-for="(ss, index) in screenshots"
        :key="ss.id"
        class="group relative bg-slate-800/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-all"
      >
        <!-- Image Container -->
        <div class="relative aspect-video overflow-hidden border-b border-white/5">
          <img
            :src="ss.url"
            :alt="`Screenshot by ${ss.player}`"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"
          ></div>

          <!-- Hover Overlay -->
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

        <!-- Info Section -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-amber-500"
              >
                <User class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold">{{ ss.player }}</h3>
                <div class="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Hash class="w-3 h-3" />
                  {{ ss.guid }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">{{
              ss.date
            }}</span>
            <button class="text-slate-400 hover:text-white transition-colors">
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="screenshots.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-slate-800/20 border border-white/5 rounded-[2rem] text-center mt-8"
    >
      <Camera class="w-16 h-16 text-slate-600 mb-6" />
      <h2 class="text-2xl font-bold text-white mb-2">No Screenshots Found</h2>
      <p class="text-slate-400">
        {{
          filterGuid
            ? 'This player has no uploaded fairshots on record.'
            : 'There are currently no screenshots available.'
        }}
      </p>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="selectedIndex !== null"
        @click="closeLightbox"
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center overscroll-none transition-all duration-300"
        :class="isZoomed ? 'overflow-auto' : 'overflow-hidden p-6'"
      >
        <!-- Top right controls -->
        <div class="fixed top-8 right-8 flex items-center gap-4 z-[110]">
          <button
            @click="toggleZoom"
            class="p-3 bg-white/10 text-white rounded-xl hover:bg-amber-500 hover:text-black transition-colors backdrop-blur-md shadow-2xl"
          >
            <ZoomOut v-if="isZoomed" class="w-6 h-6" />
            <ZoomIn v-else class="w-6 h-6" />
          </button>
          <button
            @click="closeLightbox"
            class="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md shadow-2xl"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Previous navigation -->
        <button
          @click="prevImage"
          v-if="screenshots.length > 1"
          class="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 text-white rounded-2xl hover:bg-amber-500 hover:text-black transition-colors backdrop-blur-md z-[110] shadow-2xl group"
        >
          <ChevronLeft class="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>

        <!-- Next navigation -->
        <button
          @click="nextImage"
          v-if="screenshots.length > 1"
          class="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/5 text-white rounded-2xl hover:bg-amber-500 hover:text-black transition-colors backdrop-blur-md z-[110] shadow-2xl group"
        >
          <ChevronRight class="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        <!-- Dynamic Image Wrapper -->
        <div
          class="w-full h-full flex flex-col transition-all duration-500"
          :class="isZoomed ? 'items-start justify-start p-10' : 'items-center justify-center p-6'"
        >
          <img
            :src="screenshots[selectedIndex!]?.url"
            @click.stop="toggleZoom"
            alt="Enlarged screenshot"
            class="shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500 origin-center shrink-0"
            :class="
              isZoomed
                ? 'min-w-[150vw] cursor-zoom-out rounded-xl'
                : 'max-w-full max-h-[85vh] object-contain cursor-zoom-in rounded-2xl'
            "
          />

          <div
            v-if="!isZoomed"
            @click.stop
            class="mt-6 flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white shadow-2xl z-[105]"
          >
            <User class="w-4 h-4 text-amber-500" />
            <span class="font-bold tracking-wide">{{ screenshots[selectedIndex!]?.player }}</span>
            <span class="text-slate-400 text-xs font-mono pl-3 border-l border-white/20">{{
              screenshots[selectedIndex!]?.guid
            }}</span>
            <span class="text-slate-500 text-xs font-bold pl-3 border-l border-white/20">{{
              screenshots[selectedIndex!]?.date
            }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
