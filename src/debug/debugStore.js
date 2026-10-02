import { reactive } from "vue"

const MAX_TRACE = 200

export const debugStore = reactive({
	enabled: localStorage.getItem("debug_mode") === "true",
	collapsed: false,
	trace: [],
	checked: [],
	calls: {},
	error: null,
})

export function canUseDebugMode() {
	const permissions = localStorage.getItem("permissions") || ""
	return permissions.split(",").includes("debug_view_debugmode")
}

// debug_mode may be left by another account on the same browser
export function isDebugActive() {
	return debugStore.enabled && canUseDebugMode()
}

export function setDebugMode(enabled) {
	debugStore.enabled = enabled
	localStorage.setItem("debug_mode", enabled)
	if (!enabled) {
		clearPageData()
		debugStore.error = null
	}
}

// what was recorded for the current page: API calls and permission checks
export function clearPageData() {
	debugStore.trace = []
	debugStore.checked = []
}

export function recordCall(entry) {
	debugStore.trace.push(entry)
	if (debugStore.trace.length > MAX_TRACE) debugStore.trace.shift()
}

export function recordPermissionCheck(codename) {
	if (isDebugActive() && !debugStore.checked.includes(codename)) {
		debugStore.checked.push(codename)
	}
}
