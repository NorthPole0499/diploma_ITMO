<script setup>
defineProps({
  inversed: {
    type: Boolean,
    default: false,
  },

  document: {
    type: Boolean,
    default: false,
  }
})
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
    <div style="margin-top: 1rem;">
        <svg v-if="inversed" width="50" height="30" viewBox="0 0 50 30" style="margin-left: 0.5rem;">
            <line x1="0" y1="0" x2="0" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="15" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="15" y1="0" x2="15" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round" />

            <svg v-if="document" x="30" y="6" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
              <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
              <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
            </svg>
        </svg>
        <svg v-else width="50" height="30" viewBox="0 0 50 30" style="margin-right: 0.5rem;">
            <line x1="50" y1="0" x2="50" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="35" y1="0" x2="50" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="35" y1="0" x2="35" y2="30" stroke="#000" stroke-width="1.5" stroke-linecap="round" />

            <svg v-if="document" x="0" y="6" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
              <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
              <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
            </svg>
        </svg>
        <div style="margin-left: 0.5rem; margin-right: 0.5rem;">
        N = <input placeholder="1" size="3">
        </div>
    </div>
</template>
