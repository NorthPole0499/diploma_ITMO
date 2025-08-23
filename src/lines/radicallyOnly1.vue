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
    <svg v-if="inversed" width="60" height="30" viewBox="0 0 60 30" style="margin-left: 0.5rem; margin-right: 0.5rem;">
      <line x1="5" y1="2" x2="5" y2="28" stroke="#000" stroke-width="1.3" />
      <line x1="15" y1="2" x2="15" y2="28" stroke="#000" stroke-width="1.3" />
    
      <svg v-if="document" x="25" y="5" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
        <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
        <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
      </svg>
    </svg>
    <svg v-else width="60" height="30" viewBox="0 0 60 30" style="margin-left: 0.5rem; margin-right: 0.5rem;">
      <line x1="35" y1="2" x2="35" y2="28" stroke="#000" stroke-width="1.3" />
      <line x1="45" y1="2" x2="45" y2="28" stroke="#000" stroke-width="1.3" />
    
      <svg v-if="document" x="0" y="5" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
        <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
        <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
      </svg>
    </svg>
</template>
