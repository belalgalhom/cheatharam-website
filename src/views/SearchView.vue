<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Hash, User, ShieldAlert, AlertCircle } from 'lucide-vue-next'

const searchQuery = ref('')
const searchResult = ref<any[] | null>(null)
const isSearching = ref(false)

const allPlayers = [
  { name: 'Soldier_X', guid: '0x8FA72BB3', lastSeen: '2 minutes ago', status: 'Clean' },
  { name: 'Ghost_Ops', guid: '0x1CC253DD', lastSeen: '5 hours ago', status: 'Clean' },
  { name: 'TriggerHappy', guid: '0x99B210AA', lastSeen: 'Just now', status: 'Clean' },
  { name: 'Cheater_99', guid: '0xDEADBEEF', lastSeen: '3 days ago', status: 'Banned' },
  { name: 'Silent_Dagger', guid: '0x7E3310FF', lastSeen: '1 day ago', status: 'Clean' },
]

const handleSearch = () => {
  if (!searchQuery.value) return
  
  isSearching.value = true
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase()
    searchResult.value = allPlayers.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.guid.toLowerCase().includes(query)
    )
    isSearching.value = false
  }, 600)
}
</script>

<template>
  <div class="container mx-auto px-6 py-12 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Player Database</h1>
      <p class="text-slate-400">Search for player history, GUID verification, and ban status.</p>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-12">
      <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500">
        <Search class="w-6 h-6" />
      </div>
      <input 
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text" 
        placeholder="Search by Name or GUID (e.g. 0x8FA...)" 
        class="w-full bg-slate-800/50 border-2 border-white/5 rounded-3xl py-6 pl-16 pr-32 text-xl font-medium focus:outline-none focus:border-amber-500/50 transition-all backdrop-blur-md"
      />
      <button 
        @click="handleSearch"
        class="absolute right-3 inset-y-3 px-8 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2"
      >
        <span v-if="!isSearching">Search</span>
        <span v-else class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"></span>
      </button>
    </div>

    <!-- Results -->
    <div v-if="searchResult">
      <div v-if="searchResult.length > 0" class="space-y-4">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest px-4">Found {{ searchResult.length }} Result(s)</h2>
        <div v-for="player in searchResult" :key="player.guid" 
             class="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-800/30 border border-white/5 rounded-[2rem] hover:bg-slate-800/50 transition-all">
          <div class="flex items-center gap-6 mb-4 md:mb-0">
            <div class="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-amber-500">
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
          
          <div class="flex items-center gap-8">
            <div class="text-right">
              <p class="text-xs text-slate-500 uppercase font-bold mb-1">Last Seen</p>
              <p class="font-medium">{{ player.lastSeen }}</p>
            </div>
            <div :class="[
              'px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border',
              player.status === 'Banned' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            ]">
              {{ player.status }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20 bg-slate-800/10 rounded-[3rem] border border-dashed border-white/10">
        <AlertCircle class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-slate-400">No players found</h3>
        <p class="text-slate-500 mt-2">Try searching with a different name or GUID.</p>
      </div>
    </div>
  </div>
</template>
