<script setup lang="ts">
import { ref } from 'vue'
import { Download, ShieldCheck, Zap, Cpu } from 'lucide-vue-next'

const features = [
  { icon: ShieldCheck, title: 'Kernel-Level Anti-Tamper', desc: 'Protected by low-level monitor service that blocks memory manipulation.' },
  { icon: Zap, title: 'Zero Latency', desc: 'Ultra-light footprint. Zero impact on game FPS or network stability.' },
  { icon: Cpu, title: 'Auto-Update System', desc: 'Always stay protected with our seamless background signature updates.' }
]
</script>

<template>
  <div class="container mx-auto px-6 py-20 max-w-6xl">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <!-- Content Left -->
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full border border-amber-500/20 mb-6">
          <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
          Version 1.0.0 Current Stable
        </div>
        <h1 class="text-5xl md:text-6xl font-bold mb-8 leading-tight">Secure Your Play. <span class="text-amber-500">Stay Clean.</span></h1>
        <p class="text-xl text-slate-400 mb-10 leading-relaxed">
          Join thousands of players dedicated to fair play. Our anticheat is built from the ground up to ensure Soldier of Fortune II remains the skill-based classic it was meant to be.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-12">
          <a href="#" class="group px-10 py-5 bg-amber-500 text-black font-black text-lg rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Download class="w-6 h-6 group-hover:scale-125 transition-transform" />
            DOWNLOAD CHEATHARAM
          </a>
          <a href="https://discord.gg/fPwZNBskNK" target="_blank" class="px-10 py-5 bg-slate-800 text-white font-bold text-lg rounded-2xl hover:bg-slate-700 transition-all border border-white/10 flex items-center justify-center gap-3">
            Join Support Discord
          </a>
        </div>

        <div class="flex items-center gap-6 text-slate-500 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-1 h-1 bg-slate-600 rounded-full"></div>
            Supports Windows 7 / 10 / 11
          </div>
          <div class="flex items-center gap-2">
            <div class="w-1 h-1 bg-slate-600 rounded-full"></div>
            Size: 4.2 MB
          </div>
        </div>
      </div>

      <!-- Features Right -->
      <div class="grid gap-6">
        <div v-for="feature in features" :key="feature.title"
             class="group flex gap-6 p-8 bg-slate-800/20 border border-white/5 rounded-[2.5rem] hover:bg-slate-800/40 hover:border-amber-500/20 transition-all">
          <div class="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <component :is="feature.icon" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">{{ feature.title }}</h3>
            <p class="text-slate-400 leading-relaxed text-sm">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
