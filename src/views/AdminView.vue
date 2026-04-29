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
  UploadCloud,
  DownloadCloud,
  Edit,
} from 'lucide-vue-next'

const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

import { api } from '@/utils/api'

const activeTab = ref('logs')

const logs = ref([
  {
    id: 1,
    time: '2026-04-15 02:45:12',
    type: 'Cheat Detected',
    player: 'hacker_pro',
    guid: 'DEADBE',
    action: 'Connection Closed',
    details: 'CVAR: cg_draw2d attempted change to 0',
    severity: 'high',
  },
  {
    id: 2,
    time: '2026-04-15 02:40:05',
    type: 'Screenshot Taken',
    player: 'Soldier_X',
    guid: '8FA72B',
    action: 'Stored for Review',
    details: 'Triggered by @ch_fs',
    severity: 'low',
  },
  {
    id: 3,
    time: '2026-04-15 02:38:12',
    type: 'Injection Blocked',
    player: 'Ghost_Ops',
    guid: '1CC253',
    action: 'Process Terminated',
    details: 'Unauthorized DLL access',
    severity: 'medium',
  },
  {
    id: 4,
    time: '2026-04-15 02:35:10',
    type: 'CVAR Attempted',
    player: 'Noob_01',
    guid: '7E3310',
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
    guid: 'A2B3C4',
    action: 'Reset to Default',
    details: 'Attempted to force cl_maxpackets below 30',
    severity: 'medium',
  },
  {
    id: 7,
    time: '2026-04-15 02:22:04',
    type: 'Screenshot Taken',
    player: 'TriggerHappy',
    guid: '99B210',
    action: 'Stored for Review',
    details: 'Automated interval check',
    severity: 'low',
  },
  {
    id: 8,
    time: '2026-04-15 02:15:30',
    type: 'HWID Match',
    player: 'FlaggedUser_22',
    guid: '112233',
    action: 'Connection Refused',
    details: 'Previous security violation record found',
    severity: 'high',
  },
  {
    id: 9,
    time: '2026-04-15 02:11:12',
    type: 'Script Error',
    player: 'Silent_Dagger',
    guid: '7E3310',
    action: 'Logged',
    details: 'Corrupted game script detected in memory',
    severity: 'medium',
  },
  {
    id: 10,
    time: '2026-04-15 02:05:45',
    type: 'Cheat Detected',
    player: 'unknown_00',
    guid: '667788',
    action: 'Connection Closed',
    details: 'Wallhack signature match',
    severity: 'high',
  },
  {
    id: 11,
    time: '2026-04-15 01:58:22',
    type: 'CVAR Attempted',
    player: 'Ghost_Ops',
    guid: '1CC253',
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
    details: 'Reviewed screenshots for GUID 8FA72B', // Fixed here too
    severity: 'low',
  },
  {
    id: 13,
    time: '2026-04-15 01:45:00',
    type: 'Injection Blocked',
    player: 'Cheater_Alt',
    guid: 'ABCDEF',
    action: 'Access Denied',
    details: 'External overlay detection',
    severity: 'high',
  },
  {
    id: 14,
    time: '2026-04-15 01:38:15',
    type: 'CVAR Attempted',
    player: 'Soldier_X',
    guid: '8FA72B',
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

// Whitelist Form State
const showWhitelistForm = ref(false)
const editingWhitelistId = ref<number | null>(null)
const newWhitelistName = ref('')
const newWhitelistHash = ref('')
const isAddingWhitelist = ref(false)
const whitelistStatus = ref('')
const whitelistedFiles = ref<any[]>([])

const visibleWhitelistCount = ref(10)
const isLoadingMoreWhitelist = ref(false)

const visibleWhitelists = computed(() => {
  return whitelistedFiles.value.slice(0, visibleWhitelistCount.value)
})

const loadMoreWhitelists = () => {
  if (visibleWhitelistCount.value >= whitelistedFiles.value.length) return

  isLoadingMoreWhitelist.value = true
  setTimeout(() => {
    visibleWhitelistCount.value += 10
    isLoadingMoreWhitelist.value = false
  }, 600)
}

const fetchWhitelists = async () => {
  try {
    const response = await api.get('/whitelists')
    if (response.ok) {
      const data = await response.json()
      whitelistedFiles.value = data.map((item: any) => ({
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

const deleteWhitelist = async (hash: string) => {
  try {
    const response = await api.delete(`/whitelists/${hash}`)
    if (response.ok) {
      fetchWhitelists()
    }
  } catch (e) {
    console.error('Failed to delete whitelist entry', e)
  }
}

const handleAddWhitelist = async () => {
  if (!newWhitelistName.value || !newWhitelistHash.value) return
  isAddingWhitelist.value = true
  try {
    if (editingWhitelistId.value) {
      const response = await api.put(`/whitelists/${editingWhitelistId.value}`, {
        name: newWhitelistName.value,
        hash: newWhitelistHash.value,
      })
      if (response.ok) {
        whitelistStatus.value = `Whitelist entry updated successfully.`
        newWhitelistName.value = ''
        newWhitelistHash.value = ''
        editingWhitelistId.value = null
        fetchWhitelists()
        showWhitelistForm.value = false
        setTimeout(() => {
          whitelistStatus.value = ''
        }, 3000)
      }
    } else {
      const response = await api.post('/whitelists', {
        name: newWhitelistName.value,
        hash: newWhitelistHash.value,
      })
      if (response.ok) {
        whitelistStatus.value = `File ${newWhitelistName.value} whitelisted successfully.`
        newWhitelistName.value = ''
        newWhitelistHash.value = ''
        fetchWhitelists()
        showWhitelistForm.value = false
        setTimeout(() => {
          whitelistStatus.value = ''
        }, 3000)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    isAddingWhitelist.value = false
  }
}

const editWhitelist = (file: any) => {
  newWhitelistName.value = file.name
  newWhitelistHash.value = file.hash
  editingWhitelistId.value = file.id
  showWhitelistForm.value = true
}

// GUID Form State
const showGuidForm = ref(false)
const editingGuidId = ref<number | null>(null)
const newGuidOriginal = ref('')
const newGuidCustom = ref('')
const isAddingGuid = ref(false)
const guidStatus = ref('')
const customGuidsList = ref<any[]>([])

const visibleGuidCount = ref(10)
const isLoadingMoreGuids = ref(false)

const visibleGuids = computed(() => {
  return customGuidsList.value.slice(0, visibleGuidCount.value)
})

const loadMoreGuids = () => {
  if (visibleGuidCount.value >= customGuidsList.value.length) return

  isLoadingMoreGuids.value = true
  setTimeout(() => {
    visibleGuidCount.value += 10
    isLoadingMoreGuids.value = false
  }, 600)
}

const fetchGuids = async () => {
  try {
    const response = await api.get('/guids')
    if (response.ok) {
      const data = await response.json()
      customGuidsList.value = data.map((item: any) => ({
        id: item.id,
        original: item.original_guid,
        custom: item.custom_guid,
        added: item.createdAt ? new Date(item.createdAt).toISOString().substring(0, 10) : '',
      }))
    }
  } catch (e) {
    console.error('Failed to fetch GUIDs', e)
  }
}

const handleAddGuid = async () => {
  if (!newGuidOriginal.value || !newGuidCustom.value) return
  isAddingGuid.value = true
  try {
    if (editingGuidId.value) {
      const response = await api.put(`/guids/${editingGuidId.value}`, {
        originalGuid: newGuidOriginal.value,
        customGuid: newGuidCustom.value,
      })
      if (response.ok) {
        guidStatus.value = `GUID mapping updated successfully.`
        newGuidOriginal.value = ''
        newGuidCustom.value = ''
        editingGuidId.value = null
        fetchGuids()
        showGuidForm.value = false
        setTimeout(() => {
          guidStatus.value = ''
        }, 3000)
      }
    } else {
      const response = await api.post('/guids', {
        originalGuid: newGuidOriginal.value,
        customGuid: newGuidCustom.value,
      })
      if (response.ok) {
        guidStatus.value = `Original GUID ${newGuidOriginal.value} mapped to ${newGuidCustom.value}.`
        newGuidOriginal.value = ''
        newGuidCustom.value = ''
        fetchGuids()
        showGuidForm.value = false
        setTimeout(() => {
          guidStatus.value = ''
        }, 3000)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    isAddingGuid.value = false
  }
}

const editGuid = (item: any) => {
  newGuidOriginal.value = item.original
  newGuidCustom.value = item.custom
  editingGuidId.value = item.id
  showGuidForm.value = true
}

const deleteGuid = async (originalGuid: string) => {
  try {
    const response = await api.delete(`/guids/${originalGuid}`)
    if (response.ok) {
      fetchGuids()
    }
  } catch (e) {
    console.error('Failed to delete GUID mapping', e)
  }
}

// Payload State
const payloads = ref<any[]>([])
const showPayloadForm = ref(false)
const editingPayloadId = ref<number | null>(null)
const newPayloadUrl = ref('')
const newPayloadFileName = ref('')
const newPayloadFileHash = ref('')
const newPayloadVersion = ref('')
const isAddingPayload = ref(false)
const isUploadingFile = ref(false)
const payloadStatus = ref('')

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (!file) return

    // Client-side size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      payloadStatus.value = 'File too large. Maximum size is 10MB.'
      target.value = ''
      return
    }

    isUploadingFile.value = true
    payloadStatus.value = `Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`
    try {
      const formData = new FormData()
      formData.append('payload', file)
      const res = await api.post('/upload/payload', formData)
      if (res.ok) {
        const data = await res.json()
        newPayloadUrl.value = data.url
        newPayloadFileName.value = file.name
        payloadStatus.value = 'File uploaded successfully! You can now deploy the payload.'
      } else {
        payloadStatus.value = 'File upload failed.'
      }
    } catch (e) {
      console.error(e)
      payloadStatus.value = 'File upload error.'
    } finally {
      isUploadingFile.value = false
      target.value = ''
    }
  }
}

const fetchPayloads = async () => {
  try {
    const res = await api.get('/payloads')
    if (res.ok) payloads.value = await res.json()
  } catch (e) {
    console.error(e)
  }
}

const handleAddPayload = async () => {
  if (!newPayloadUrl.value || !newPayloadFileName.value || !newPayloadVersion.value) return
  isAddingPayload.value = true
  try {
    if (editingPayloadId.value) {
      const res = await api.put(`/payloads/${editingPayloadId.value}`, {
        url: newPayloadUrl.value,
        fileName: newPayloadFileName.value,
        version: newPayloadVersion.value,
        fileHash: newPayloadFileHash.value,
      })
      if (res.ok) {
        payloadStatus.value = `Payload updated successfully.`
        newPayloadUrl.value = ''
        newPayloadFileName.value = ''
        newPayloadFileHash.value = ''
        newPayloadVersion.value = ''
        editingPayloadId.value = null
        showPayloadForm.value = false
        fetchPayloads()
        setTimeout(() => {
          payloadStatus.value = ''
        }, 3000)
      }
    } else {
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
    }
  } catch (e) {
    console.error(e)
  } finally {
    isAddingPayload.value = false
  }
}

const editPayload = (p: any) => {
  newPayloadUrl.value = p.url
  newPayloadFileName.value = p.fileName
  newPayloadFileHash.value = p.fileHash
  newPayloadVersion.value = p.version
  editingPayloadId.value = p.id
  showPayloadForm.value = true
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

// Loader State
const loaders = ref<any[]>([])
const showLoaderForm = ref(false)
const editingLoaderId = ref<number | null>(null)
const newLoaderUrl = ref('')
const newLoaderFileName = ref('')
const newLoaderVersion = ref('')
const newLoaderClientSecret = ref('')
const isAddingLoader = ref(false)
const isUploadingLoaderFile = ref(false)
const loaderStatus = ref('')

const handleLoaderFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      loaderStatus.value = 'File too large. Maximum size is 10MB.'
      target.value = ''
      return
    }

    isUploadingLoaderFile.value = true
    loaderStatus.value = `Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`
    try {
      const formData = new FormData()
      formData.append('loader', file)
      const res = await api.post('/upload/loader', formData)
      if (res.ok) {
        const data = await res.json()
        newLoaderUrl.value = data.url
        newLoaderFileName.value = file.name
        loaderStatus.value = 'File uploaded successfully! You can now deploy the loader.'
      } else {
        loaderStatus.value = 'File upload failed.'
      }
    } catch (e) {
      console.error(e)
      loaderStatus.value = 'File upload error.'
    } finally {
      isUploadingLoaderFile.value = false
      target.value = ''
    }
  }
}

const fetchLoaders = async () => {
  try {
    const res = await api.get('/loaders')
    if (res.ok) loaders.value = await res.json()
  } catch (e) {
    console.error(e)
  }
}

const handleAddLoader = async () => {
  if (!newLoaderUrl.value || !newLoaderFileName.value || !newLoaderVersion.value || !newLoaderClientSecret.value) return
  isAddingLoader.value = true
  try {
    if (editingLoaderId.value) {
      const res = await api.put(`/loaders/${editingLoaderId.value}`, {
        url: newLoaderUrl.value,
        fileName: newLoaderFileName.value,
        version: newLoaderVersion.value,
        clientSecret: newLoaderClientSecret.value,
      })
      if (res.ok) {
        loaderStatus.value = `Loader updated successfully.`
        newLoaderUrl.value = ''
        newLoaderFileName.value = ''
        newLoaderVersion.value = ''
        newLoaderClientSecret.value = ''
        editingLoaderId.value = null
        showLoaderForm.value = false
        fetchLoaders()
        setTimeout(() => {
          loaderStatus.value = ''
        }, 3000)
      }
    } else {
      const res = await api.post('/loaders', {
        url: newLoaderUrl.value,
        fileName: newLoaderFileName.value,
        version: newLoaderVersion.value,
        clientSecret: newLoaderClientSecret.value,
        isActive: true,
      })
      if (res.ok) {
        loaderStatus.value = `Loader v${newLoaderVersion.value} registered successfully.`
        newLoaderUrl.value = ''
        newLoaderFileName.value = ''
        newLoaderVersion.value = ''
        newLoaderClientSecret.value = ''
        showLoaderForm.value = false
        fetchLoaders()
        setTimeout(() => {
          loaderStatus.value = ''
        }, 3000)
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    isAddingLoader.value = false
  }
}

const editLoader = (l: any) => {
  newLoaderUrl.value = l.url
  newLoaderFileName.value = l.fileName
  newLoaderVersion.value = l.version
  newLoaderClientSecret.value = l.clientSecret
  editingLoaderId.value = l.id
  showLoaderForm.value = true
}

const activateLoader = async (id: number) => {
  try {
    const res = await api.put(`/loaders/${id}/active`)
    if (res.ok) fetchLoaders()
  } catch (e) {
    console.error(e)
  }
}

const deleteLoader = async (id: number) => {
  try {
    const res = await api.delete(`/loaders/${id}`)
    if (res.ok) fetchLoaders()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  if (api.getToken()) {
    isAuthenticated.value = true
    fetchWhitelists()
    fetchGuids()
    fetchPayloads()
    fetchLoaders()
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
    const data = await response.json()
    api.setToken(data.token)
    isAuthenticated.value = true
    fetchWhitelists()
    fetchGuids()
    fetchPayloads()
    fetchLoaders()
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
    <!-- Login Form -->
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
        class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
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

    <!-- Admin Dashboard -->
    <div v-else class="animate-fadeIn">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-4">
            <ShieldAlert class="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
            Admin Panel
          </h1>
          <p class="text-slate-400 text-sm md:text-base">
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

      <!-- Tabs Navigation -->
      <div
        class="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 mb-8 md:mb-12 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm"
      >
        <button
          @click="activeTab = 'logs'"
          :class="[
            'px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === 'logs'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Terminal class="w-4 h-4" />
          System Logs
        </button>
        <button
          @click="activeTab = 'whitelist'"
          :class="[
            'px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === 'whitelist'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <FileCode class="w-4 h-4" />
          File Whitelist
        </button>
        <button
          @click="activeTab = 'guids'"
          :class="[
            'px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === 'guids'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Fingerprint class="w-4 h-4" />
          Custom GUIDs
        </button>
        <button
          @click="activeTab = 'payloads'"
          :class="[
            'px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === 'payloads'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <Package class="w-4 h-4" />
          Payloads
        </button>
        <button
          @click="activeTab = 'loaders'"
          :class="[
            'px-4 md:px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === 'loaders'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white',
          ]"
        >
          <DownloadCloud class="w-4 h-4" />
          Loaders
        </button>
      </div>

      <!-- Tab: System Logs -->
      <div v-if="activeTab === 'logs'" class="space-y-12 animate-fadeIn">
        <!-- Stats Cards -->
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

        <!-- Logs Table -->
        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div class="hidden md:block overflow-x-auto">
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

          <!-- Mobile Cards Layout -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="log in visibleLogs"
              :key="log.id"
              class="p-6 space-y-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex justify-between items-start">
                <span class="text-xs font-mono text-slate-500">{{ log.time }}</span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
                    log.severity === 'high'
                      ? 'bg-red-500/20 text-red-500'
                      : log.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-slate-700/50 text-slate-400',
                  ]"
                >
                  {{ log.type }}
                </span>
              </div>
              <div>
                <div class="font-bold text-white">{{ log.player }}</div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">{{ log.guid }}</div>
              </div>
              <div class="bg-white/5 p-3 rounded-xl border border-white/5">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Action</div>
                <div class="text-sm text-slate-200">{{ log.action }}</div>
                <div v-if="log.details" class="text-xs text-slate-500 mt-1 italic">
                  {{ log.details }}
                </div>
              </div>
            </div>
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

      <!-- Tab: File Whitelist -->
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
            @click="showWhitelistForm = !showWhitelistForm; if(!showWhitelistForm) { editingWhitelistId = null; newWhitelistName = ''; newWhitelistHash = ''; }"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showWhitelistForm ? 'Cancel' : 'Add Whitelist Entry' }}
          </button>
        </div>

        <!-- Success Status -->
        <div
          v-if="whitelistStatus"
          class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
        >
          <Check class="w-5 h-5" />
          {{ whitelistStatus }}
        </div>

        <div
          v-if="showWhitelistForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 max-w-2xl shadow-2xl mb-8 animate-fadeIn mt-6"
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

            <button
              type="submit"
              :disabled="isAddingWhitelist || !newWhitelistName || !newWhitelistHash"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingWhitelist" class="w-5 h-5" />
              <span v-if="!isAddingWhitelist">{{ editingWhitelistId ? 'Update' : 'Save File Hash' }}</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <!-- Whitelisted Files Table -->
        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl w-full"
        >
          <div class="hidden md:block overflow-x-auto">
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
                  v-for="file in visibleWhitelists"
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
                  <td class="px-8 py-6 text-sm text-slate-400">
                    {{ file.added }}
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-2">
                      <button
                        @click="editWhitelist(file)"
                        class="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="Edit"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteWhitelist(file.hash)"
                        class="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
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

          <!-- Mobile Cards Layout -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="file in visibleWhitelists"
              :key="file.id"
              class="p-6 space-y-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="font-bold text-lg text-white">{{ file.name }}</div>
                <div class="flex items-center gap-2">
                  <button
                    @click="editWhitelist(file)"
                    class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteWhitelist(file.hash)"
                    class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">File Hash</div>
                <div class="text-xs text-amber-500 font-mono bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 break-all">
                  {{ file.hash }}
                </div>
              </div>
              <div class="flex justify-between items-center text-xs text-slate-500">
                <span>Added on</span>
                <span class="font-bold text-slate-400">{{ file.added }}</span>
              </div>
            </div>
            <div v-if="whitelistedFiles.length === 0" class="p-10 text-center text-slate-500 text-sm">
              No whitelisted files found.
            </div>
          </div>
          <div
            v-if="visibleWhitelistCount < whitelistedFiles.length"
            class="px-8 py-4 bg-white/5 border-t border-white/5 text-center"
          >
            <button
              @click="loadMoreWhitelists"
              :disabled="isLoadingMoreWhitelist"
              class="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <span
                v-if="isLoadingMoreWhitelist"
                class="animate-spin w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
              ></span>
              {{ isLoadingMoreWhitelist ? 'Loading...' : 'Load more files...' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab: Custom GUIDs -->
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
            @click="showGuidForm = !showGuidForm; if(!showGuidForm) { editingGuidId = null; newGuidOriginal = ''; newGuidCustom = ''; }"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showGuidForm ? 'Cancel' : 'Map Custom GUID' }}
          </button>
        </div>

        <!-- Success Status -->
        <div
          v-if="guidStatus"
          class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
        >
          <Check class="w-5 h-5" />
          {{ guidStatus }}
        </div>

        <div
          v-if="showGuidForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 max-w-2xl shadow-2xl mb-8 animate-fadeIn mt-6"
        >
          <form @submit.prevent="handleAddGuid" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold tracking-widest text-slate-500 mb-2 ml-1"
                  >Original GUID</label
                >
                <input
                  v-model="newGuidOriginal"
                  type="text"
                  required
                  placeholder="e.g. 8FA72B"
                  maxlength="6"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 px-4 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label class="block text-xs font-bold tracking-widest text-slate-500 mb-2 ml-1"
                  >New Custom GUID</label
                >
                <input
                  v-model="newGuidCustom"
                  type="text"
                  required
                  placeholder="e.g. ADMIN1"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 px-4 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isAddingGuid || !newGuidOriginal || !newGuidCustom"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingGuid" class="w-5 h-5" />
              <span v-if="!isAddingGuid">{{ editingGuidId ? 'Update' : 'Authorize GUID Mapping' }}</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <!-- Custom GUIDs Table -->
        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl w-full"
        >
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/5 border-b border-white/5">
                  <th class="px-8 py-6 text-xs font-bold tracking-widest text-slate-500">
                    Original GUID
                  </th>
                  <th class="px-8 py-6 text-xs font-bold tracking-widest text-slate-500">
                    Custom Assigned
                  </th>
                  <th class="px-8 py-6 text-xs font-bold tracking-widest text-slate-500">
                    Date Added
                  </th>
                  <th class="px-8 py-6 text-xs font-bold tracking-widest text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="item in visibleGuids"
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
                  <td class="px-8 py-6 text-sm text-slate-400">
                    {{ item.added }}
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-2">
                      <button
                        @click="editGuid(item)"
                        class="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="Edit"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteGuid(item.original)"
                        class="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
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

          <!-- Mobile Cards Layout -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="item in visibleGuids"
              :key="item.id"
              class="p-6 space-y-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div class="space-y-1">
                  <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Original GUID</div>
                  <div class="text-sm font-bold text-slate-400 font-mono tracking-wider">{{ item.original }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="editGuid(item)"
                    class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteGuid(item.original)"
                    class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                <div class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Mapped To</div>
                <div class="text-lg font-bold text-emerald-400 font-mono tracking-wider">{{ item.custom }}</div>
              </div>
              <div class="flex justify-between items-center text-xs text-slate-500">
                <span>Created</span>
                <span class="font-bold text-slate-400">{{ item.added }}</span>
              </div>
            </div>
            <div v-if="customGuidsList.length === 0" class="p-10 text-center text-slate-500 text-sm">
              No custom GUIDs found.
            </div>
          </div>
          <div
            v-if="visibleGuidCount < customGuidsList.length"
            class="px-8 py-4 bg-white/5 border-t border-white/5 text-center"
          >
            <button
              @click="loadMoreGuids"
              :disabled="isLoadingMoreGuids"
              class="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <span
                v-if="isLoadingMoreGuids"
                class="animate-spin w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
              ></span>
              {{ isLoadingMoreGuids ? 'Loading...' : 'Load more mappings...' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab: Payloads -->
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
            @click="showPayloadForm = !showPayloadForm; if(!showPayloadForm) { editingPayloadId = null; newPayloadUrl = ''; newPayloadFileName = ''; newPayloadFileHash = ''; newPayloadVersion = ''; }"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showPayloadForm ? 'Cancel' : 'Add Payload' }}
          </button>
        </div>

        <!-- Success Status -->
        <div
          v-if="payloadStatus"
          class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
        >
          <Check class="w-5 h-5" />
          {{ payloadStatus }}
        </div>

        <!-- Add Payload Form -->
        <div
          v-if="showPayloadForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-fadeIn"
        >
          <form @submit.prevent="handleAddPayload" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Payload Upload</label
                >
                <label
                  class="flex items-center justify-center w-full py-4 px-4 border-2 border-dashed border-amber-500/30 rounded-2xl bg-slate-800/20 hover:bg-slate-800/80 hover:border-amber-500/50 transition-all cursor-pointer group gap-3"
                >
                  <input
                    type="file"
                    class="hidden"
                    @change="handleFileSelect"
                    :disabled="isUploadingFile"
                  />
                  <UploadCloud
                    v-if="!isUploadingFile"
                    class="w-6 h-6 text-amber-500/80 group-hover:text-amber-400"
                  />
                  <span
                    v-if="!isUploadingFile"
                    class="font-bold tracking-wide text-amber-500/80 group-hover:text-amber-400"
                    >Click to Upload Payload File</span
                  >
                  <span v-else class="text-amber-500 font-bold flex items-center gap-2">
                    <span
                      class="animate-spin w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
                    ></span>
                    Uploading File...
                  </span>
                </label>
              </div>

              <div class="md:col-span-2 flex items-center my-0">
                <div class="h-px bg-white/5 flex-1"></div>
                <span class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                  >OR PROVIDE URL MANUALLY</span
                >
                <div class="h-px bg-white/5 flex-1"></div>
              </div>

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
              <span v-if="!isAddingPayload">{{ editingPayloadId ? 'Update' : 'Deploy Payload' }}</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <!-- Payloads Table -->
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
                        @click="editPayload(p)"
                        class="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="Edit"
                      >
                        <Edit class="w-4 h-4" />
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

          <!-- Mobile Cards Layout -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="p in payloads"
              :key="p.id"
              class="p-6 space-y-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-bold text-white">{{ p.fileName }}</div>
                  <div class="text-[10px] text-slate-500 font-mono mt-1 break-all">{{ p.url }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="!p.isActive"
                    @click="activatePayload(p.id)"
                    class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    <Star class="w-4 h-4" />
                  </button>
                  <button
                    @click="editPayload(p)"
                    class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deletePayload(p.id)"
                    class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-lg text-xs font-black bg-slate-700/50 text-slate-300 font-mono">
                  v{{ p.version }}
                </span>
                <span
                  v-if="p.isActive"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE
                </span>
              </div>
              <div class="space-y-1">
                <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hash</div>
                <div class="text-xs text-amber-500 font-mono bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 break-all">
                  {{ p.fileHash }}
                </div>
              </div>
            </div>
            <div v-if="payloads.length === 0" class="p-10 text-center text-slate-500 text-sm">
              No payloads found.
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Loaders -->
      <div v-else-if="activeTab === 'loaders'" class="animate-fadeIn space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <DownloadCloud class="w-8 h-8 text-amber-500" />
              Loader Manager
            </h2>
            <p class="text-slate-400">Manage client loaders deployed to game servers.</p>
          </div>
          <button
            @click="showLoaderForm = !showLoaderForm; if(!showLoaderForm) { editingLoaderId = null; newLoaderUrl = ''; newLoaderFileName = ''; newLoaderVersion = ''; newLoaderClientSecret = ''; }"
            class="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle class="w-5 h-5" />
            {{ showLoaderForm ? 'Cancel' : 'Add Loader' }}
          </button>
        </div>

        <!-- Success Status -->
        <div
          v-if="loaderStatus"
          class="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20"
        >
          <Check class="w-5 h-5" />
          {{ loaderStatus }}
        </div>

        <!-- Add Loader Form -->
        <div
          v-if="showLoaderForm"
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-fadeIn"
        >
          <form @submit.prevent="handleAddLoader" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Loader Upload</label
                >
                <label
                  class="flex items-center justify-center w-full py-4 px-4 border-2 border-dashed border-amber-500/30 rounded-2xl bg-slate-800/20 hover:bg-slate-800/80 hover:border-amber-500/50 transition-all cursor-pointer group gap-3"
                >
                  <input
                    type="file"
                    class="hidden"
                    @change="handleLoaderFileSelect"
                    :disabled="isUploadingLoaderFile"
                  />
                  <UploadCloud
                    v-if="!isUploadingLoaderFile"
                    class="w-6 h-6 text-amber-500/80 group-hover:text-amber-400"
                  />
                  <span
                    v-if="!isUploadingLoaderFile"
                    class="font-bold tracking-wide text-amber-500/80 group-hover:text-amber-400"
                    >Click to Upload Loader File</span
                  >
                  <span v-else class="text-amber-500 font-bold flex items-center gap-2">
                    <span
                      class="animate-spin w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
                    ></span>
                    Uploading File...
                  </span>
                </label>
              </div>

              <div class="md:col-span-2 flex items-center my-0">
                <div class="h-px bg-white/5 flex-1"></div>
                <span class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                  >OR PROVIDE URL MANUALLY</span
                >
                <div class="h-px bg-white/5 flex-1"></div>
              </div>

              <div class="md:col-span-2">
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Download URL</label
                >
                <input
                  v-model="newLoaderUrl"
                  type="url"
                  required
                  placeholder="https://cdn.example.com/loader.exe"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >File Name</label
                >
                <input
                  v-model="newLoaderFileName"
                  type="text"
                  required
                  placeholder="e.g. loader_v2.exe"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Version</label
                >
                <input
                  v-model="newLoaderVersion"
                  type="text"
                  required
                  placeholder="e.g. 2.1.0"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1"
                  >Client Secret</label
                >
                <input
                  v-model="newLoaderClientSecret"
                  type="text"
                  required
                  placeholder="e.g. secret123"
                  class="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                />
              </div>
            </div>
            <button
              type="submit"
              :disabled="isAddingLoader"
              class="py-4 px-8 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle v-if="!isAddingLoader" class="w-5 h-5" />
              <span v-if="!isAddingLoader">{{ editingLoaderId ? 'Update' : 'Deploy Loader' }}</span>
              <span
                v-else
                class="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              ></span>
            </button>
          </form>
        </div>

        <!-- Loaders Table -->
        <div
          class="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div class="overflow-x-auto hidden md:block">
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
                    Client Secret
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
                <tr v-for="l in loaders" :key="l.id" class="hover:bg-white/5 transition-colors">
                  <td class="px-8 py-6">
                    <div class="font-bold text-white">{{ l.fileName }}</div>
                    <div class="text-xs text-slate-500 font-mono mt-1 truncate max-w-[200px]">
                      {{ l.url }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      class="px-3 py-1 rounded-lg text-xs font-black bg-slate-700/50 text-slate-300 font-mono"
                      >v{{ l.version }}</span
                    >
                  </td>
                  <td class="px-8 py-6">
                    <div class="text-[10px] text-amber-500 font-mono bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 break-all w-fit">
                      {{ l.clientSecret }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      v-if="l.isActive"
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
                        v-if="!l.isActive"
                        @click="activateLoader(l.id)"
                        class="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 flex items-center gap-2"
                      >
                        <Star class="w-4 h-4" /> Activate
                      </button>
                      <button
                        @click="editLoader(l)"
                        class="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                        title="Edit"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteLoader(l.id)"
                        class="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loaders.length === 0">
                  <td colspan="5" class="px-8 py-10 text-center text-slate-500 text-sm">
                    No loaders found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards Layout -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="l in loaders"
              :key="l.id"
              class="p-6 space-y-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-bold text-white">{{ l.fileName }}</div>
                  <div class="text-[10px] text-slate-500 font-mono mt-1 break-all">{{ l.url }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="!l.isActive"
                    @click="activateLoader(l.id)"
                    class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    <Star class="w-4 h-4" />
                  </button>
                  <button
                    @click="editLoader(l)"
                    class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteLoader(l.id)"
                    class="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 rounded-lg text-xs font-black bg-slate-700/50 text-slate-300 font-mono">
                    v{{ l.version }}
                  </span>
                  <span
                    v-if="l.isActive"
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400"
                  >
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Secret</div>
                  <div class="text-xs text-amber-500 font-mono bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 break-all">
                    {{ l.clientSecret }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loaders.length === 0" class="p-10 text-center text-slate-500 text-sm">
              No loaders found.
            </div>
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

/* Scrollbar Utility */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
