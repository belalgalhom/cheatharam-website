<script setup lang="ts">
import { ref } from 'vue'
import { Server, User, Globe, Hash } from 'lucide-vue-next'

const players = ref([
  { id: 1, name: 'Soldier_X', guid: '0x8FA72BB3', server: 'SOF2 | Public Frag-Fest', country: 'US' },
  { id: 2, name: 'Ghost_Ops', guid: '0x1CC253DD', server: 'SOF2 | COMPETITIVE HUB', country: 'DE' },
  { id: 3, name: 'TriggerHappy', guid: '0x99B210AA', server: 'SOF2 | Public Frag-Fest', country: 'RU' },
  { id: 4, name: 'Silent_Dagger', guid: '0x7E3310FF', server: 'SOF2 | Clan War Server', country: 'UK' },
  { id: 5, name: 'ReconMaster', guid: '0x44B29EE1', server: 'SOF2 | COMPETITIVE HUB', country: 'FR' },
])
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <h1 class="text-4xl font-bold mb-2">Live Players</h1>
        <p class="text-slate-400">Current active players verified by the anticheat system.</p>
      </div>
      <div class="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 uppercase font-bold">Total Players</span>
          <span class="text-2xl font-bold text-amber-500">{{ players.length }}</span>
        </div>
        <div class="w-px h-10 bg-white/10"></div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 uppercase font-bold">Servers Active</span>
          <span class="text-2xl font-bold text-white">3</span>
        </div>
      </div>
    </div>

    <div class="grid gap-4">
      <!-- Table Header -->
      <div class="hidden md:grid grid-cols-4 px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
        <span>Player Name</span>
        <span>Unique GUID</span>
        <span>Connected Server</span>
        <span class="text-right">Status</span>
      </div>

      <!-- Player Cards -->
      <div v-for="player in players" :key="player.id" 
           class="group grid md:grid-cols-4 items-center px-8 py-6 bg-slate-800/20 border border-white/5 rounded-3xl hover:bg-slate-800/40 hover:border-amber-500/30 transition-all cursor-default">
        <div class="flex items-center gap-4 mb-4 md:mb-0">
          <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-amber-500">
            <User class="w-5 h-5" />
          </div>
          <span class="font-bold text-lg group-hover:text-amber-500 transition-colors">{{ player.name }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-slate-400 mb-2 md:mb-0">
          <Hash class="w-4 h-4" />
          <code class="text-xs font-mono bg-black/30 px-2 py-1 rounded-md">{{ player.guid }}</code>
        </div>

        <div class="flex items-center gap-2 text-slate-400 mb-4 md:mb-0">
          <Server class="w-4 h-4 text-emerald-500" />
          <span class="text-sm">{{ player.server }}</span>
        </div>

        <div class="flex justify-end">
          <span class="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
