<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Shield, Users, Search, Camera, Download, Home } from 'lucide-vue-next'

const isOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Online', path: '/online', icon: Users },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Screenshots', path: '/screenshots', icon: Camera },
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    scrolled ? 'py-4 bg-slate-900/80 backdrop-blur-xl border-white/10' : 'py-8 bg-transparent border-transparent'
  ]">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
            <Shield class="w-6 h-6 text-black fill-current" />
          </div>
          <span class="text-xl font-black tracking-tighter uppercase group-hover:text-amber-500 transition-colors">
            CHEAT<span class="text-amber-500 tracking-normal transition-colors">HARAM</span>
          </span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path"
                      class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group py-2"
                      active-class="text-amber-500!">
            {{ link.name }}
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </RouterLink>
          
          <RouterLink to="/download" 
                      class="px-6 py-2.5 bg-amber-500 text-black font-bold text-sm rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Download class="w-4 h-4" />
            DOWNLOAD
          </RouterLink>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isOpen = !isOpen" class="md:hidden text-white p-2">
          <Menu v-if="!isOpen" class="w-8 h-8" />
          <X v-else class="w-8 h-8" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isOpen" class="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-6 space-y-4 shadow-2xl">
        <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path"
                    @click="isOpen = false"
                    class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800 transition-all">
          <component :is="link.icon" class="w-6 h-6 text-amber-500" />
          <span class="font-bold text-lg">{{ link.name }}</span>
        </RouterLink>
        <RouterLink to="/download" 
                    @click="isOpen = false"
                    class="flex items-center justify-center gap-4 p-4 rounded-xl bg-amber-500 text-black font-bold text-lg">
          <Download class="w-6 h-6" />
          Download AC
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.text-amber-500\! {
  color: #f59e0b !important;
}
</style>
