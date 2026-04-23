<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { User, Hash, Clock, Camera, History, ShieldAlert } from 'lucide-vue-next'
import { api } from '@/utils/api'

const route = useRoute()
const playerId = route.params.id

const player = ref<any>(null)
const nameHistory = ref<any[]>([])
const screenshots = ref<any[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [playerRes, namesRes, shotsRes] = await Promise.all([
      api.get(`/clients/${playerId}`),
      api.get(`/players/${playerId}/names`),
      api.get(`/players/${playerId}/fairshots`),
    ])

    if (playerRes.ok) player.value = await playerRes.json()
    if (namesRes.ok) nameHistory.value = await namesRes.json()
    if (shotsRes.ok) screenshots.value = await shotsRes.json()
  } catch (err) {
    console.error('Failed to load player details:', err)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}
</script>

<template>
  <div class="container mx-auto px-6 py-12 max-w-5xl">
    <div v-if="isLoading" class="text-center py-20">
      <div
        class="animate-spin w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full mx-auto"
      ></div>
    </div>

    <div v-else-if="player">
      <div
        class="bg-slate-800/40 border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center">
            <User class="w-10 h-10 text-amber-500" />
          </div>
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ player.currentName }}</h1>
            <div class="flex gap-4 text-sm font-mono text-slate-400">
              <span class="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-lg">
                <Hash class="w-4 h-4" /> {{ player.active_guid }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="text-center bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <p class="text-xs text-slate-500 uppercase font-bold mb-1">Total Screenshots</p>
            <p class="text-2xl font-black text-amber-500">{{ screenshots.length }}</p>
          </div>
          <div class="text-center bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <p class="text-xs text-slate-500 uppercase font-bold mb-1">Name Changes</p>
            <p class="text-2xl font-black text-blue-500">{{ nameHistory.length }}</p>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-slate-800/30 border border-white/5 rounded-3xl p-6">
          <h2
            class="text-xl font-bold flex items-center gap-2 mb-6 text-white border-b border-white/5 pb-4"
          >
            <ShieldAlert class="w-5 h-5 text-emerald-500" /> Identity Information
          </h2>
          <ul class="space-y-4 text-sm">
            <li class="flex justify-between items-center p-3 bg-black/20 rounded-xl">
              <span class="text-slate-400">Hardware ID (HWID)</span>
              <span class="font-mono text-white">{{ player.hwid }}</span>
            </li>
            <li class="flex justify-between items-center p-3 bg-black/20 rounded-xl">
              <span class="text-slate-400">Original GUID</span>
              <span class="font-mono text-white">{{ player.original_guid }}</span>
            </li>
            <li class="flex justify-between items-center p-3 bg-black/20 rounded-xl">
              <span class="text-slate-400">Custom/Spoofed GUID</span>
              <span
                :class="[
                  'font-mono font-bold',
                  player.custom_guid ? 'text-amber-500' : 'text-slate-600',
                ]"
              >
                {{ player.custom_guid || 'None' }}
              </span>
            </li>
            <li class="flex justify-between items-center p-3 bg-black/20 rounded-xl">
              <span class="text-slate-400">First Seen</span>
              <span class="text-white">{{ formatDate(player.createdAt) }}</span>
            </li>
          </ul>
        </div>

        <div
          class="bg-slate-800/30 border border-white/5 rounded-3xl p-6 flex flex-col max-h-[400px]"
        >
          <h2
            class="text-xl font-bold flex items-center gap-2 mb-6 text-white border-b border-white/5 pb-4"
          >
            <History class="w-5 h-5 text-blue-500" /> Name History
          </h2>
          <div class="overflow-y-auto pr-2 space-y-3">
            <div v-if="nameHistory.length === 0" class="text-slate-500 text-center py-4">
              No previous names recorded.
            </div>
            <div
              v-for="entry in nameHistory"
              :key="entry.createdAt"
              class="p-3 bg-black/20 rounded-xl flex justify-between items-center"
            >
              <div>
                <p class="font-bold text-white">{{ entry.name }}</p>
                <p class="text-[10px] text-emerald-500 uppercase font-black mt-1">
                  {{ entry.server || 'Unknown Server' }}
                </p>
              </div>
              <span class="text-xs text-slate-500">{{ formatDate(entry.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
