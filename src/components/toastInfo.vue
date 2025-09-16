<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['closeToast'])

let isVisible = ref(true)

onMounted(() => {
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false 
  }, 1200)
  
  setTimeout(() => {
    emit('closeToast')
  }, 1500)
})


</script>

<template>
    <div v-shpw="isVisible" :class="['toast', { 'fade-out': !isVisible }]">
        <div v-if="props.type === 'text'">
            Текст скопирован в буфер обмена
        </div>
        <div v-else>
            Снимок экрана сделан
        </div>
    </div>
</template>

<style>
.toast {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1%;
    left: 1%;
    z-index: 2000;
    width: 200px;
    height: 100px;
    border: 2px green solid;
    border-radius: 5%;
    background-color: white;
    text-transform: none;

    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-in-out;
}

.toast.fade-out {
  opacity: 0;
  transform: translateY(-20px);
}
</style>