<script setup lang="ts">
import { ref } from 'vue'
import { User, Server, ShieldCheck, Download, Users, Camera } from 'lucide-vue-next'

const developers = [
  {
    name: 'Dracula',
  },
  {
    name: 'Devil',
  },
]
</script>

<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section -->
    <section
      class="relative h-auto md:h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden -mt-24 pt-32 md:pt-0"
    >
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10 text-center">
        <div
          class="mb-8 inline-block p-4 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10"
        >
          <img src="@/assets/home-logo.jpg" alt="SOF2 Logo" class="h-32 md:h-48 object-contain" />
        </div>
        <h1
          class="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent"
        >
          CHEATHARAM
        </h1>
        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          State-of-the-art protection for Soldier of Fortune II: Double Helix. Ensuring a fair,
          clean, and competitive environment for all players.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/download"
            class="px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Download class="w-5 h-5 group-hover:bounce" />
            Download Now
          </RouterLink>
          <RouterLink
            to="/online"
            class="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            <Users class="w-5 h-5" />
            Online Players
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Developers Section -->
    <section class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Anticheat Developers</h2>
        <div class="h-1 w-20 bg-amber-500 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          v-for="dev in developers"
          :key="dev.name"
          class="group p-8 rounded-3xl bg-slate-800/30 border border-white/5 backdrop-blur-sm hover:border-amber-500/30 transition-all hover:bg-slate-800/50"
        >
          <div class="flex items-center gap-6 mb-6">
            <div
              class="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform"
            >
              <User class="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ dev.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="flex flex-col items-center justify-center my-12">
      <div
        class="bg-slate-800/30 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm w-full max-w-[400px] hover:bg-slate-800/50 transition-all hover:border-indigo-500/30"
      >
        <div class="flex items-center gap-3 mb-6">
          <h2 class="text-2xl font-bold text-white">Join Our Discord</h2>
        </div>

        <iframe
          src="https://discord.com/widget?id=1450621334596878356&theme=dark"
          width="100%"
          height="500"
          allowtransparency="true"
          frameborder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          class="rounded-xl bg-slate-900"
        ></iframe>
      </div>
    </div>

    <!-- Features Quick Look -->
    <section
      class="container mx-auto px-6 bg-slate-900/50 py-20 rounded-[3rem] border border-white/5"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="mx-auto w-12 h-12 mb-6 text-amber-500">
            <ShieldCheck class="w-full h-full" />
          </div>
          <h3 class="text-xl font-bold mb-2">Kernel Protection</h3>
          <p class="text-slate-400">Deep integration to block cheats at the source.</p>
        </div>
        <div class="text-center">
          <div class="mx-auto w-12 h-12 mb-6 text-amber-500"><Camera class="w-full h-full" /></div>
          <h3 class="text-xl font-bold mb-2">Automated SS</h3>
          <p class="text-slate-400">Regular player screenshots with cloud logging.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-radial-gradient {
  background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
.group-hover\:bounce {
  animation: bounce 0.6s infinite ease-in-out;
}
</style>
