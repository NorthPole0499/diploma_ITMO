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
    <svg v-if="inversed" width="80" height="30" viewBox="0 0 80 30">
        <line x1="0" y1="0" x2="25" y2="15" stroke="#000" stroke-width="1" stroke-linecap="round"/>
        <line x1="0" y1="30" x2="25" y2="15" stroke="#000" stroke-width="1" stroke-linecap="round"/>
        <circle cx="40" cy="15" r="10" stroke="#000" stroke-width="1" fill="white" />

        <svg v-if="document" x="60" y="5" width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
          <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
        </svg>
    </svg>
    <svg v-else width="80" height="30" viewBox="0 0 80 30">
        <line x1="80" y1="0" x2="55" y2="15" stroke="#000" stroke-width="1" stroke-linecap="round"/>
        <line x1="80" y1="30" x2="55" y2="15" stroke="#000" stroke-width="1" stroke-linecap="round"/>
        <circle cx="40" cy="15" r="10" stroke="#000" stroke-width="1" fill="white" />

        <svg v-if="document" x="0" y="5" width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10" stroke="#000" stroke-width="1" fill="white" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1.3" />
          <line x1="10" y1="0" x2="10" y2="20" stroke="#000" stroke-width="1.3" />
        </svg>
        
    </svg>
</template>
