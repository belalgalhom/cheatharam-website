<script setup lang="ts">
import { ref } from 'vue'
import { Camera, User, Hash, Maximize2, Download } from 'lucide-vue-next'

const screenshots = ref([
  { id: 1, player: 'Soldier_X', guid: '0x8FA72BB3', date: '2024-04-15 10:30', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
  { id: 2, player: 'TriggerHappy', guid: '0x99B210AA', date: '2024-04-15 09:12', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
  { id: 3, player: 'Ghost_Ops', guid: '0x1CC253DD', date: '2024-04-14 23:45', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
  { id: 4, player: 'Silent_Dagger', guid: '0x7E3310FF', date: '2024-04-14 21:20', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
  { id: 5, player: 'ReconMaster', guid: '0x44B29EE1', date: '2024-04-14 18:05', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
  { id: 6, player: 'Vanguard', guid: '0x22F109BB', date: '2024-04-14 15:30', url: '/src/assets/sof2_screenshot1_1776206465789.png' },
])

const selectedImage = ref<string | null>(null)

const openLightbox = (url: string) => {
  selectedImage.value = url
}

const closeLightbox = () => {
  selectedImage.value = null
}
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="text-4xl font-bold mb-2">Player Screenshots</h1>
        <p class="text-slate-400">Automated captures from protected game sessions.</p>
      </div>
      <div class="hidden md:flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
        <Camera class="w-5 h-5" />
        <span class="font-bold text-sm tracking-widest uppercase">Live Submissions</span>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="ss in screenshots" :key="ss.id" 
           class="group relative bg-slate-800/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-all">
        <!-- Image Container -->
        <div class="relative aspect-video overflow-hidden">
          <img :src="ss.url" :alt="`Screenshot by ${ss.player}`" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <button @click="openLightbox(ss.url)" 
                    class="p-4 bg-amber-500 text-black rounded-full hover:scale-110 transition-transform shadow-xl">
              <Maximize2 class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Info Section -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-amber-500">
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
            <span class="text-xs text-slate-500 uppercase font-bold tracking-wider">{{ ss.date }}</span>
            <button class="text-slate-400 hover:text-white transition-colors">
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="selectedImage" 
           @click="closeLightbox"
           class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out">
        <img :src="selectedImage" alt="Enlarged screenshot" class="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
        <button class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
          <Maximize2 class="w-10 h-10 rotate-45" />
        </button>
      </div>
    </Teleport>
  </div>
</template>
