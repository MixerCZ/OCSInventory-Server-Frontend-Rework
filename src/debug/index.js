import { registerSlot } from "@/extensions/slotRegistry"
import DebugTrace from "@/components/Debug/DebugTrace.vue"
import { clearTrace } from "./debugStore"
import { setResolverApi } from "./debugResolver"

export function installDebug({ router, api }) {
	setResolverApi(api)

	// query only changes (pagination, filters) keep the trace of the page
	router.afterEach((to, from) => {
		if (to.path !== from.path) clearTrace()
	})

	registerSlot("debug.panel", { order: 20, title: "debug.trace", component: DebugTrace })
}
