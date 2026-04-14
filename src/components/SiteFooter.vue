<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-slate-950 border-t border-white/5 pt-20 pb-10">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <RouterLink to="/" class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-black fill-current" />
            </div>
            <span class="text-xl font-black tracking-tighter uppercase">
              CHEAT<span class="text-amber-500 tracking-normal">HARAM</span>
            </span>
          </RouterLink>
          <p class="text-slate-500 max-w-sm leading-relaxed mb-8">
            Providing top-tier security for the Soldier of Fortune II community. Dedicated to
            maintaining fair play and competitive integrity through advanced anti-tamper technology.
          </p>

        </div>

        <!-- Links -->
        <div>
          <h4 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">Navigation</h4>
          <ul class="space-y-4">
            <li>
              <RouterLink to="/" class="text-slate-500 hover:text-amber-500 transition-colors"
                >Home</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/online" class="text-slate-500 hover:text-amber-500 transition-colors"
                >Online Players</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/search" class="text-slate-500 hover:text-amber-500 transition-colors"
                >Player Search</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/screenshots"
                class="text-slate-500 hover:text-amber-500 transition-colors"
                >Screenshots</RouterLink
              >
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">System</h4>
          <ul class="space-y-4">
            <li>
              <RouterLink
                to="/download"
                class="text-slate-500 hover:text-amber-500 transition-colors"
                >Download</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/terms" class="text-slate-500 hover:text-amber-500 transition-colors"
                >Terms of Service</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/privacy" class="text-slate-500 hover:text-amber-500 transition-colors"
                >Privacy Policy</RouterLink
              >
            </li>

          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div
        class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-sm"
      >
        <p>© 2026 CheatHaram Anticheat System.</p>
        <div class="flex items-center gap-6">
          <RouterLink to="/terms" class="hover:text-amber-500 transition-colors">Terms of Service</RouterLink>
          <RouterLink to="/privacy" class="hover:text-amber-500 transition-colors">Privacy Policy</RouterLink>
        </div>
        <p>Developed by Dracula &amp; Devil.</p>
      </div>
    </div>
  </footer>
</template>
