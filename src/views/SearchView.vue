<script setup lang="ts">
import { ref } from 'vue'
import { Search, Hash, User, Camera, AlertCircle } from 'lucide-vue-next'
import { api } from '@/utils/api'

const searchQuery = ref('')
const searchResult = ref<any[] | null>(null)
const isSearching = ref(false)

const formatLastSeen = (dateStr: string) => {
  if (!dateStr) return 'Unknown'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
  return `${Math.floor(diff / 86400000)} days ago`
}

const handleSearch = async () => {
  if (!searchQuery.value) return

  isSearching.value = true
  try {
    const query = searchQuery.value.trim()

    // Fetch online players and search results in parallel
    const [clientNameRes, clientGuidRes, onlineRes] = await Promise.all([
      api.get(`/clients/search?name=${encodeURIComponent(query)}`),
      api.get(`/clients/search?guid=${encodeURIComponent(query)}`),
      api.get('/players/online'),
    ])

    let clients: any[] = []

    if (clientNameRes.ok) {
      const data = await clientNameRes.json()
      clients = Array.isArray(data) ? data : []
    }

    if (clientGuidRes.ok) {
      const data = await clientGuidRes.json()
      if (Array.isArray(data)) {
        // Merge and avoid duplicates by ID
        data.forEach((client) => {
          if (!clients.find((c) => c.id === client.id)) {
            clients.push(client)
          }
        })
      }
    }

    let onlineGuids: string[] = []
    if (onlineRes.ok) {
      const data = await onlineRes.json()
      const onlinePlayers = (data && data.players) || []
      onlineGuids = onlinePlayers.map((p: any) => p.guid)
    }

    // Map to UI internal structure
    searchResult.value = clients.map((c) => ({
      name: c.currentName || 'UnnamedPlayer',
      guid: c.guid,
      lastSeen: formatLastSeen(c.lastSeen),
      online: onlineGuids.includes(c.guid),
    }))
  } catch (err) {
    console.error('Search failed:', err)
    searchResult.value = []
  } finally {
    isSearching.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-6 py-12 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Player Database</h1>
      <p class="text-slate-400">Search for player history and GUID verification.</p>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-12">
      <div
        class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 z-10"
      >
        <Search class="w-6 h-6" />
      </div>
      <input
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Name or GUID"
        class="w-full bg-slate-800/50 border-2 border-white/5 rounded-2xl md:rounded-3xl py-4 md:py-6 pl-12 md:pl-16 pr-28 md:pr-32 text-lg md:text-xl font-medium focus:outline-none focus:border-amber-500/50 transition-all backdrop-blur-md"
      />
      <button
        @click="handleSearch"
        class="absolute right-2 md:right-3 inset-y-2 md:inset-y-3 px-4 md:px-8 bg-amber-500 text-black font-bold rounded-xl md:rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
      >
        <span v-if="!isSearching">Search</span>
        <span
          v-else
          class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
        ></span>
      </button>
    </div>

    <!-- Results -->
    <div v-if="searchResult">
      <div v-if="searchResult.length > 0" class="space-y-4">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest px-4">
          Found {{ searchResult.length }} Result(s)
        </h2>
        <div
          v-for="player in searchResult"
          :key="player.guid"
          class="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-800/30 border border-white/5 rounded-[2rem] hover:bg-slate-800/50 transition-all"
        >
          <div class="flex items-center gap-6 mb-4 md:mb-0">
            <div
              class="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-amber-500"
            >
              <User class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-bold">{{ player.name }}</h3>
              <div class="flex items-center gap-2 text-slate-400 text-sm">
                <Hash class="w-4 h-4" />
                <code>{{ player.guid }}</code>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
            <div v-if="!player.online" class="text-center md:text-right w-full md:w-auto">
              <p class="text-[10px] text-slate-500 uppercase font-black mb-1">Last Seen</p>
              <p class="font-bold text-sm">{{ player.lastSeen }}</p>
            </div>
            <div
              :class="[
                'flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border w-full sm:w-auto',
                player.online
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-700/50 text-slate-400 border-white/10',
              ]"
            >
              <span class="relative flex w-2.5 h-2.5">
                <span
                  v-if="player.online"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span
                  :class="[
                    'relative inline-flex rounded-full w-2.5 h-2.5',
                    player.online ? 'bg-emerald-400' : 'bg-slate-500',
                  ]"
                ></span>
              </span>
              {{ player.online ? 'Online' : 'Offline' }}
            </div>
            <RouterLink
              :to="{ path: '/screenshots', query: { guid: player.guid, name: player.name } }"
              class="flex items-center justify-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-black rounded-xl border border-white/10 hover:border-amber-500/30 transition-all w-full sm:w-auto"
            >
              <Camera class="w-4 h-4 text-amber-500" />
              Screenshots
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-else
        class="text-center py-20 bg-slate-800/10 rounded-[3rem] border border-dashed border-white/10"
      >
        <AlertCircle class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-slate-400">No players found</h3>
        <p class="text-slate-500 mt-2">Try searching with a different name or GUID.</p>
      </div>
    </div>
  </div>
</template>
