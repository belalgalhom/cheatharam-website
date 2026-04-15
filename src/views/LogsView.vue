<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Lock, User, Terminal, LogOut, ShieldAlert, Camera, Search } from 'lucide-vue-next'

const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'cheatharam2026'

const logs = ref([
  {
    id: 1,
    time: '2026-04-15 02:45:12',
    type: 'Cheat Detected',
    player: 'hacker_pro',
    guid: '0xDEADBEEF',
    action: 'Connection Closed',
    details: 'CVAR: cg_draw2d attempted change to 0',
    severity: 'high',
  },
  {
    id: 2,
    time: '2026-04-15 02:40:05',
    type: 'Screenshot Taken',
    player: 'Soldier_X',
    guid: '0x8FA72BB3',
    action: 'Stored for Review',
    details: 'Triggered by @ch_fs',
    severity: 'low',
  },
  {
    id: 3,
    time: '2026-04-15 02:38:12',
    type: 'Injection Blocked',
    player: 'Ghost_Ops',
    guid: '0x1CC253DD',
    action: 'Process Terminated',
    details: 'Unauthorized DLL access',
    severity: 'medium',
  },
  {
    id: 4,
    time: '2026-04-15 02:35:10',
    type: 'CVAR Attempted',
    player: 'Noob_01',
    guid: '0x7E3310FF',
    action: 'Blocked',
    details: 'Tried to change cg_fov to 150 (He tried to do it)',
    severity: 'medium',
  },
  {
    id: 5,
    time: '2026-04-15 02:30:45',
    type: 'Login Attempt',
    player: 'Admin',
    guid: 'INTERNAL',
    action: 'Success',
    details: 'Console access granted',
    severity: 'low',
  },
  {
    id: 6,
    time: '2026-04-15 02:28:19',
    type: 'CVAR Attempted',
    player: 'Recruit_99',
    guid: '0xA2B3C4D5',
    action: 'Reset to Default',
    details: 'Attempted to force cl_maxpackets below 30',
    severity: 'medium',
  },
  {
    id: 7,
    time: '2026-04-15 02:22:04',
    type: 'Screenshot Taken',
    player: 'TriggerHappy',
    guid: '0x99B210AA',
    action: 'Stored for Review',
    details: 'Automated interval check',
    severity: 'low',
  },
  {
    id: 8,
    time: '2026-04-15 02:15:30',
    type: 'HWID Match',
    player: 'FlaggedUser_22',
    guid: '0x11223344',
    action: 'Connection Refused',
    details: 'Previous security violation record found',
    severity: 'high',
  },
  {
    id: 9,
    time: '2026-04-15 02:11:12',
    type: 'Script Error',
    player: 'Silent_Dagger',
    guid: '0x7E3310FF',
    action: 'Logged',
    details: 'Corrupted game script detected in memory',
    severity: 'medium',
  },
  {
    id: 10,
    time: '2026-04-15 02:05:45',
    type: 'Cheat Detected',
    player: 'unknown_00',
    guid: '0x66778899',
    action: 'Connection Closed',
    details: 'Wallhack signature match',
    severity: 'high',
  },
  {
    id: 11,
    time: '2026-04-15 01:58:22',
    type: 'CVAR Attempted',
    player: 'Ghost_Ops',
    guid: '0x1CC253DD',
    action: 'Blocked',
    details: 'Attempted change to rate (He tried to do it)',
    severity: 'medium',
  },
  {
    id: 12,
    time: '2026-04-15 01:50:10',
    type: 'Admin Action',
    player: 'Dracula',
    guid: 'INTERNAL',
    action: 'Manual Check',
    details: 'Reviewed screenshots for GUID 0x8FA72BB3',
    severity: 'low',
  },
  {
    id: 13,
    time: '2026-04-15 01:45:00',
    type: 'Injection Blocked',
    player: 'Cheater_Alt',
    guid: '0xABCDEF01',
    action: 'Access Denied',
    details: 'External overlay detection',
    severity: 'high',
  },
  {
    id: 14,
    time: '2026-04-15 01:38:15',
    type: 'CVAR Attempted',
    player: 'Soldier_X',
    guid: '0x8FA72BB3',
    action: 'Reset to Default',
    details: 'Attempted to change g_syncronousClients',
    severity: 'medium',
  },
  {
    id: 15,
    time: '2026-04-15 01:30:22',
    type: 'System Boot',
    player: 'SERVER',
    guid: 'INTERNAL',
    action: 'Success',
    details: 'Anticheat engine initialized',
    severity: 'low',
  },
])

const visibleLogsCount = ref(10)
const isLoadingMore = ref(false)

const visibleLogs = computed(() => {
  return logs.value.slice(0, visibleLogsCount.value)
})

const loadMoreLogs = () => {
  if (visibleLogsCount.value >= logs.value.length) return

  isLoadingMore.value = true
  setTimeout(() => {
    visibleLogsCount.value += 10
    isLoadingMore.value = false
  }, 600)
}

onMounted(() => {
  const savedAuth = localStorage.getItem('ch_auth')
  if (savedAuth === 'true') {
    isAuthenticated.value = true
  }
})

const handleLogin = () => {
  isLoggingIn.value = true
  loginError.value = ''

  setTimeout(() => {
    if (username.value === ADMIN_USER && password.value === ADMIN_PASS) {
      isAuthenticated.value = true
      localStorage.setItem('ch_auth', 'true')
    } else {
      loginError.value = 'Invalid username or password'
    }
    isLoggingIn.value = false
  }, 800)
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('ch_auth')
}
</script>

<template>
  <div class="container mx-auto px-6 py-12 max-w-6xl">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20">
      <div class="text-center mb-10">
        <div
          class="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
        >
          <Lock class="w-10 h-10 text-amber-500" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Access</h1>
        <p class="text-slate-400">Please enter your credentials to view system logs.</p>
      </div>

      <div
        class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl"
      >
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
              >Username</label
            >
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                v-model="username"
                type="text"
                placeholder="Enter username"
                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
              >Password</label
            >
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div
            v-if="loginError"
            class="text-red-400 text-sm font-medium animate-shake text-center px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20"
          >
            {{ loginError }}
          </div>

          <button
            type="submit"
            :disabled="isLoggingIn"
            class="w-full py-4 bg-amber-500 text-black font-black text-lg rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoggingIn">Sign In</span>
            <span
              v-else
              class="animate-spin w-6 h-6 border-2 border-black/30 border-t-black rounded-full"
            ></span>
          </button>
        </form>
      </div>
    </div>

    <!-- Logs Dashboard -->
    <div v-else class="animate-fadeIn">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2 flex items-center gap-4">
            <Terminal class="w-10 h-10 text-amber-500" />
            System Logs
          </h1>
          <p class="text-slate-400">Monitoring real-time anticheat activity and security events.</p>
        </div>
        <button
          @click="handleLogout"
          class="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all flex items-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          Log Out
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          class="bg-slate-800/20 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm hover:border-amber-500/20 transition-all group"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform"
            >
              <ShieldAlert class="w-6 h-6" />
            </div>
            <span class="text-slate-400 font-bold text-sm uppercase tracking-widest"
              >Detections</span
            >
          </div>
          <div class="text-4xl font-black text-white">428</div>
          <p class="text-red-500 text-xs font-bold mt-2">+12 since yesterday</p>
        </div>

        <div
          class="bg-slate-800/20 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm hover:border-amber-500/20 transition-all group"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform"
            >
              <Camera class="w-6 h-6" />
            </div>
            <span class="text-slate-400 font-bold text-sm uppercase tracking-widest"
              >Screenshots</span
            >
          </div>
          <div class="text-4xl font-black text-white">1,248</div>
          <p class="text-amber-500 text-xs font-bold mt-2">Active storage</p>
        </div>

        <div
          class="bg-slate-800/20 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm hover:border-amber-500/20 transition-all group"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform"
            >
              <Search class="w-6 h-6" />
            </div>
            <span class="text-slate-400 font-bold text-sm uppercase tracking-widest"
              >Player Checks</span
            >
          </div>
          <div class="text-4xl font-black text-white">12,050</div>
          <p class="text-emerald-500 text-xs font-bold mt-2">Real-time scan</p>
        </div>
      </div>

      <!-- Logs Table -->
      <div
        class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/5">
                <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Timestamp
                </th>
                <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Event Type
                </th>
                <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Player / GUID
                </th>
                <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Action Taken
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="log in visibleLogs"
                :key="log.id"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="px-8 py-6 text-sm font-medium text-slate-400 font-mono">
                  {{ log.time }}
                </td>
                <td class="px-8 py-6">
                  <span
                    :class="[
                      'px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider',
                      log.severity === 'high'
                        ? 'bg-red-500/20 text-red-500'
                        : log.severity === 'medium'
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-slate-700/50 text-slate-400',
                    ]"
                  >
                    {{ log.type }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="font-bold text-white">{{ log.player }}</div>
                  <div class="text-xs text-slate-500 font-mono mt-1">{{ log.guid }}</div>
                </td>
                <td class="px-8 py-6">
                  <div class="text-sm text-slate-300">{{ log.action }}</div>
                  <div v-if="log.details" class="text-xs text-slate-500 mt-1 italic">
                    {{ log.details }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="visibleLogsCount < logs.length"
          class="px-8 py-4 bg-white/5 border-t border-white/5 text-center"
        >
          <button
            @click="loadMoreLogs"
            :disabled="isLoadingMore"
            class="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            <span
              v-if="isLoadingMore"
              class="animate-spin w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
            ></span>
            {{ isLoadingMore ? 'Loading...' : 'Load older logs...' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
