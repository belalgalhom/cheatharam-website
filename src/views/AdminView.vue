<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Lock,
  User,
  Terminal,
  LogOut,
  ShieldAlert,
  Camera,
  Search,
  FileCode,
  Fingerprint,
  PlusCircle,
  Check,
  Package,
  Trash2,
  Star,
} from 'lucide-vue-next'

const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

import { api } from '@/utils/api'

const activeTab = ref('logs')

// --- Dummy Logs Data ---
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

// ==========================================
// WHITELIST LOGIC
// ==========================================
const showWhitelistForm = ref(false)
const newWhitelistName = ref('')
const newWhitelistHash = ref('')
const isAddingWhitelist = ref(false)
const whitelistStatus = ref('')
const whitelistedFiles = ref<any[]>([])

const fetchWhitelists = async () => {
  try {
    const response = await api.get('/whitelists')
    if (response.ok) {
      const responseBody = await response.json()
      const items = responseBody.data || []
      whitelistedFiles.value = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        hash: item.hash,
        added: item.createdAt ? new Date(item.createdAt).toISOString().substring(0, 10) : '',
      }))
    } else if (response.status === 401) {
      handleLogout()
    }
  } catch (e) {
    console.error('Failed to fetch whitelists', e)
  }
}

const handleAddWhitelist = async () => {
  if (!newWhitelistName.value || !newWhitelistHash.value) return
  isAddingWhitelist.value = true
  try {
    const response = await api.post('/whitelists', {
      name: newWhitelistName.value,
      hash: newWhitelistHash.value,
    })
    if (response.ok) {
      whitelistStatus.value = `File ${newWhitelistName.value} successfully whitelisted.`
      newWhitelistName.value = ''
      newWhitelistHash.value = ''
      fetchWhitelists()
      showWhitelistForm.value = false
      setTimeout(() => {
        whitelistStatus.value = ''
      }, 3000)
    }
  } catch (err) {
    console.error(err)
  } finally {
    isAddingWhitelist.value = false
  }
}

const deleteWhitelist = async (hash: string) => {
  if (!confirm('Are you sure you want to remove this file from the whitelist?')) return
  try {
    const res = await api.delete(`/whitelists/${hash}`)
    if (res.ok) {
      fetchWhitelists()
    }
  } catch (e) {
    console.error('Failed to delete whitelist', e)
  }
}

// ==========================================
// CUSTOM GUID LOGIC
// ==========================================
const showGuidForm = ref(false)
const newGuidOriginal = ref('')
const newGuidCustom = ref('')
const isAddingGuid = ref(false)
const guidStatus = ref('')
const customGuidsList = ref<any[]>([])

const fetchGuids = async () => {
  try {
    const response = await api.get('/guids')
    if (response.ok) {
      const responseBody = await response.json()
      const items = responseBody.data || []
      customGuidsList.value = items.map((item: any) => ({
        id: item.id,
        original: item.original_guid,
        custom: item.custom_guid,
        added: item.createdAt ? new Date(item.createdAt).toISOString().substring(0, 10) : '',
      }))
    }
  } catch (e) {
    console.error('Failed to fetch custom guids', e)
  }
}

const handleAddGuid = async () => {
  if (!newGuidOriginal.value || !newGuidCustom.value) return
  isAddingGuid.value = true
  try {
    const res = await api.post('/guids', {
      originalGuid: newGuidOriginal.value.toUpperCase(),
      customGuid: newGuidCustom.value.toUpperCase(),
    })

    if (res.ok) {
      guidStatus.value = `Original GUID ${newGuidOriginal.value} mapped to ${newGuidCustom.value}.`
      newGuidOriginal.value = ''
      newGuidCustom.value = ''
      fetchGuids()
      showGuidForm.value = false
      setTimeout(() => {
        guidStatus.value = ''
      }, 3000)
    }
  } catch (e) {
    console.error('Failed to map GUID', e)
  } finally {
    isAddingGuid.value = false
  }
}

const deleteGuid = async (originalGuid: string) => {
  if (!confirm('Are you sure you want to remove this GUID mapping?')) return
  try {
    const res = await api.delete(`/guids/${originalGuid}`)
    if (res.ok) fetchGuids()
  } catch (e) {
    console.error('Failed to delete GUID mapping', e)
  }
}

// ==========================================
// PAYLOADS LOGIC
// ==========================================
const payloads = ref<any[]>([])
const showPayloadForm = ref(false)
const newPayloadUrl = ref('')
const newPayloadFileName = ref('')
const newPayloadFileHash = ref('')
const newPayloadVersion = ref('')
const isAddingPayload = ref(false)
const payloadStatus = ref('')

const fetchPayloads = async () => {
  try {
    const res = await api.get('/payloads')
    if (res.ok) {
      const responseBody = await res.json()
      payloads.value = responseBody.data || []
    }
  } catch (e) {
    console.error('Failed to fetch payloads', e)
  }
}

const handleAddPayload = async () => {
  if (
    !newPayloadUrl.value ||
    !newPayloadFileName.value ||
    !newPayloadFileHash.value ||
    !newPayloadVersion.value
  )
    return
  isAddingPayload.value = true
  try {
    const res = await api.post('/payloads', {
      url: newPayloadUrl.value,
      fileName: newPayloadFileName.value,
      fileHash: newPayloadFileHash.value,
      version: newPayloadVersion.value,
      isActive: true,
    })
    if (res.ok) {
      payloadStatus.value = `Payload v${newPayloadVersion.value} registered successfully.`
      newPayloadUrl.value = ''
      newPayloadFileName.value = ''
      newPayloadFileHash.value = ''
      newPayloadVersion.value = ''
      showPayloadForm.value = false
      fetchPayloads()
      setTimeout(() => {
        payloadStatus.value = ''
      }, 3000)
    }
  } catch (e) {
    console.error(e)
  } finally {
    isAddingPayload.value = false
  }
}

const activatePayload = async (id: number) => {
  try {
    const res = await api.put(`/payloads/${id}/active`)
    if (res.ok) fetchPayloads()
  } catch (e) {
    console.error(e)
  }
}

const deletePayload = async (id: number) => {
  try {
    const res = await api.delete(`/payloads/${id}`)
    if (res.ok) fetchPayloads()
  } catch (e) {
    console.error(e)
  }
}

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
onMounted(() => {
  if (api.getToken()) {
    isAuthenticated.value = true
    fetchWhitelists()
    fetchPayloads()
    fetchGuids()
  }
})

const handleLogin = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    const response = await api.post('/login', {
      username: username.value,
      password: password.value,
    })
    if (!response.ok) throw new Error('Invalid username or password')

    const responseBody = await response.json()
    api.setToken(responseBody.data.token)

    isAuthenticated.value = true
    fetchWhitelists()
    fetchPayloads()
    fetchGuids()
  } catch (err: any) {
    loginError.value = err.message || 'Login failed'
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  api.clearToken()
  activeTab.value = 'logs'
}
</script>

<template>
  <div class="container mx-auto px-6 py-12 max-w-6xl">
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20">
      <div class="text-center mb-10">
        <div
          class="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
        >
          <Lock class="w-10 h-10 text-amber-500" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Access</h1>
        <p class="text-slate-400">Please enter your credentials to view the control panel.</p>
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

    <div v-else class="animate-fadeIn">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2 flex items-center gap-4">
            <ShieldAlert class="w-10 h-10 text-amber-500" />
            Admin Control Panel
          </h1>
          <p class="text-slate-400">
            System surveillance, whitelist management, and security overrides.
          </p>
        </div>
        <button
          @click="handleLogout"
          class="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all flex items-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          Log Out
        </button>
      </div>

      <div
        class="flex flex-wrap gap-4 mb-12 bg-slate-900/40 p-2 rounded-2xl border border-white/5 inline-flex backdrop-blur-sm"
      >
        <button
          @click="activeTab = 'logs'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
            activeTab === 'logs'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Terminal class="w-4 h-4" /> System Logs
        </button>
        <button
          @click="activeTab = 'whitelist'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
            activeTab === 'whitelist'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <FileCode class="w-4 h-4" /> File Whitelist
        </button>
        <button
          @click="activeTab = 'guids'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
            activeTab === 'guids'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Fingerprint class="w-4 h-4" /> Custom GUIDs
        </button>
        <button
          @click="activeTab = 'payloads'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
            activeTab === 'payloads'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Package class="w-4 h-4" /> Payloads
        </button>
      </div>

      <div v-if="activeTab === 'logs'" class="space-y-12 animate-fadeIn">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div v-else-if="activeTab === 'whitelist'" class="animate-fadeIn">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FileCode class="w-8 h-8 text-amber-500" />
              File Whitelist
            </h2>
            <p class="text-slate-400">
              Add trusted file hashes (MD5, SHA-256) to prevent false positive bans.
            </p>
          </div>
          <button
            @click="showWhitelistForm = !showWhitelistForm"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showWhitelistForm ? 'Cancel Form' : 'Add Whitelist Entry' }}
          </button>
        </div>

        <div
          v-if="showWhitelistForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 max-w-2xl shadow-2xl mb-8 animate-fadeIn"
        >
          <form @submit.prevent="handleAddWhitelist" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >File Name</label
                >
                <input
                  v-model="newWhitelistName"
                  type="text"
                  required
                  placeholder="e.g. custom_sounds.pk3"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >File Hash</label
                >
                <input
                  v-model="newWhitelistHash"
                  type="text"
                  required
                  placeholder="e.g. 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div
              v-if="whitelistStatus"
              class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
            >
              <Check class="w-5 h-5" />
              {{ whitelistStatus }}
            </div>

            <button
              type="submit"
              :disabled="isAddingWhitelist || !newWhitelistName || !newWhitelistHash"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingWhitelist" class="w-5 h-5" />
              <span v-if="!isAddingWhitelist">Save File Hash</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl w-full"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/5 border-b border-white/5">
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    File Name
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Hash Match
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Date Added
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="file in whitelistedFiles"
                  :key="file.id"
                  class="hover:bg-white/5 transition-colors group"
                >
                  <td class="px-8 py-6">
                    <div class="font-bold text-white">{{ file.name }}</div>
                  </td>
                  <td class="px-8 py-6">
                    <div
                      class="text-xs text-amber-500 font-mono bg-amber-500/10 inline-block px-3 py-1 rounded-lg border border-amber-500/20 break-all max-w-[200px] md:max-w-md"
                    >
                      {{ file.hash }}
                    </div>
                  </td>
                  <td class="px-8 py-6 text-sm text-slate-400">{{ file.added }}</td>
                  <td class="px-8 py-6">
                    <button
                      @click="deleteWhitelist(file.hash)"
                      class="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                      title="Delete"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr v-if="whitelistedFiles.length === 0">
                  <td colspan="4" class="px-8 py-10 text-center text-slate-500 text-sm">
                    No whitelisted files found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'guids'" class="animate-fadeIn">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Fingerprint class="w-8 h-8 text-amber-500" />
              Custom GUIDs
            </h2>
            <p class="text-slate-400">Map original hardware GUIDs to custom spoofed identifiers.</p>
          </div>
          <button
            @click="showGuidForm = !showGuidForm"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showGuidForm ? 'Cancel Mapping' : 'Map Custom GUID' }}
          </button>
        </div>

        <div
          v-if="showGuidForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 max-w-2xl shadow-2xl mb-8 animate-fadeIn"
        >
          <form @submit.prevent="handleAddGuid" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Original GUID</label
                >
                <input
                  v-model="newGuidOriginal"
                  type="text"
                  required
                  placeholder="e.g. 0x8FA72BB3"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono uppercase focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >New Custom GUID</label
                >
                <input
                  v-model="newGuidCustom"
                  type="text"
                  required
                  placeholder="e.g. 0xADMIN123"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono uppercase focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div
              v-if="guidStatus"
              class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
            >
              <Check class="w-5 h-5" />
              {{ guidStatus }}
            </div>

            <button
              type="submit"
              :disabled="isAddingGuid || !newGuidOriginal || !newGuidCustom"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingGuid" class="w-5 h-5" />
              <span v-if="!isAddingGuid">Authorize GUID Mapping</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl w-full"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/5 border-b border-white/5">
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Original GUID
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Custom Assigned
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Date Added
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="item in customGuidsList"
                  :key="item.id"
                  class="hover:bg-white/5 transition-colors group"
                >
                  <td class="px-8 py-6">
                    <div class="text-sm font-bold text-slate-400 font-mono tracking-wider">
                      {{ item.original }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div class="text-sm font-bold text-emerald-400 font-mono tracking-wider">
                      {{ item.custom }}
                    </div>
                  </td>
                  <td class="px-8 py-6 text-sm text-slate-400">{{ item.added }}</td>
                  <td class="px-8 py-6">
                    <button
                      @click="deleteGuid(item.original)"
                      class="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                      title="Delete Mapping"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr v-if="customGuidsList.length === 0">
                  <td colspan="4" class="px-8 py-10 text-center text-slate-500 text-sm">
                    No custom GUIDs found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'payloads'" class="animate-fadeIn space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Package class="w-8 h-8 text-amber-500" />
              Payload Manager
            </h2>
            <p class="text-slate-400">Manage anticheat client payloads deployed to game servers.</p>
          </div>
          <button
            @click="showPayloadForm = !showPayloadForm"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showPayloadForm ? 'Cancel' : 'Add Payload' }}
          </button>
        </div>

        <div
          v-if="payloadStatus"
          class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
        >
          <Check class="w-5 h-5" />
          {{ payloadStatus }}
        </div>

        <div
          v-if="showPayloadForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl animate-fadeIn"
        >
          <form @submit.prevent="handleAddPayload" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Download URL</label
                >
                <input
                  v-model="newPayloadUrl"
                  type="url"
                  required
                  placeholder="https://cdn.example.com/ac-client.zip"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >File Name</label
                >
                <input
                  v-model="newPayloadFileName"
                  type="text"
                  required
                  placeholder="e.g. ac-client-v2.zip"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Version</label
                >
                <input
                  v-model="newPayloadVersion"
                  type="text"
                  required
                  placeholder="e.g. 2.1.0"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >SHA-256 File Hash</label
                >
                <input
                  v-model="newPayloadFileHash"
                  type="text"
                  required
                  placeholder="e.g. 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a..."
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
            </div>
            <button
              type="submit"
              :disabled="isAddingPayload"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingPayload" class="w-5 h-5" />
              <span v-if="!isAddingPayload">Deploy Payload</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/5 border-b border-white/5">
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    File Name
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Version
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Hash
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Status
                  </th>
                  <th class="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="p in payloads" :key="p.id" class="hover:bg-white/5 transition-colors">
                  <td class="px-8 py-6">
                    <div class="font-bold text-white">{{ p.fileName }}</div>
                    <div class="text-xs text-slate-500 font-mono mt-1 truncate max-w-[200px]">
                      {{ p.url }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      class="px-3 py-1 rounded-lg text-xs font-black bg-slate-700/50 text-slate-300 font-mono"
                      >v{{ p.version }}</span
                    >
                  </td>
                  <td class="px-8 py-6">
                    <div
                      class="text-xs text-amber-500 font-mono bg-amber-500/10 inline-block px-3 py-1 rounded-lg border border-amber-500/20 truncate max-w-[160px]"
                    >
                      {{ p.fileHash }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      v-if="p.isActive"
                      class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 w-fit"
                    >
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE
                    </span>
                    <span
                      v-else
                      class="px-3 py-1 rounded-full text-xs font-black bg-slate-700/50 text-slate-400"
                      >INACTIVE</span
                    >
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-2">
                      <button
                        v-if="!p.isActive"
                        @click="activatePayload(p.id)"
                        class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                        title="Set as Active"
                      >
                        <Star class="w-4 h-4" />
                      </button>
                      <button
                        @click="deletePayload(p.id)"
                        class="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="payloads.length === 0">
                  <td colspan="5" class="px-8 py-10 text-center text-slate-500 text-sm">
                    No payloads found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
