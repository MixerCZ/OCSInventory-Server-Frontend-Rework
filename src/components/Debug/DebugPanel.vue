<template>
	<div
		v-if="active"
		class="debug-panel d-print-none"
	>
		<div
			class="navbar navbar-expand debug-panel-bar"
			data-bs-theme="dark"
		>
			<div class="container-fluid">
				<span
					class="navbar-text debug-panel-title"
					:title="$t('debug.title')"
				>
					<font-awesome-icon :icon="['fas', 'bug']" />
				</span>
				<ul class="navbar-nav">
					<li
						v-for="(section, idx) in sections"
						:key="idx"
						class="nav-item"
					>
						<button
							type="button"
							class="nav-link"
							:class="{ active: idx === activeSection && !store.collapsed }"
							@click="select(idx)"
						>
							{{ sectionTitle(section) }}
						</button>
					</li>
				</ul>
				<div class="navbar-nav ms-auto">
					<button
						type="button"
						class="nav-link"
						:title="store.collapsed ? $t('debug.expand') : $t('debug.collapse')"
						@click="store.collapsed = !store.collapsed"
					>
						<font-awesome-icon :icon="['fas', store.collapsed ? 'angle-up' : 'angle-down']" />
					</button>
					<button
						type="button"
						class="nav-link"
						:title="$t('debug.close')"
						@click="close"
					>
						<font-awesome-icon :icon="['fas', 'xmark']" />
					</button>
				</div>
			</div>
		</div>
		<div
			v-show="!store.collapsed"
			class="debug-panel-body"
		>
			<Alert
				v-if="store.error"
				variant="danger"
				:message="store.error"
			/>
			<component
				:is="currentComponent"
				v-if="currentComponent"
				v-bind="context"
			/>
		</div>
	</div>
</template>

<script>
import { defineAsyncComponent, markRaw } from "vue"
import { getSlotEntries } from "@/extensions/slotRegistry"
import { debugStore, isDebugActive, setDebugMode } from "@/debug/debugStore"

export default {
	name: "DebugPanel",
	data() {
		return {
			store: debugStore,
			activeSection: 0,
		}
	},
	computed: {
		active() {
			return isDebugActive()
		},
		context() {
			return {
				route: this.$route,
				trace: this.store.trace,
				checked: this.store.checked,
				calls: this.store.calls,
			}
		},
		// depends on the route, so sections registered by extensions loaded
		// during navigation show up
		sections() {
			return getSlotEntries("debug.panel", this.context)
		},
		currentComponent() {
			const section = this.sections[this.activeSection] || this.sections[0]
			if (!section) return null
			// same convention as ExtensionSlot: a function is a lazy loader
			return markRaw(
				typeof section.component === "function"
					? defineAsyncComponent(section.component)
					: section.component
			)
		},
	},
	methods: {
		select(idx) {
			this.activeSection = idx
			this.store.collapsed = false
		},
		sectionTitle(section) {
			return this.$te(section.title) ? this.$t(section.title) : section.title
		},
		close() {
			setDebugMode(false)
		},
	},
}
</script>
