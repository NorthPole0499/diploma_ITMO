<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  note: Object
})

const emit = defineEmits(['update:note', 'remove'])

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const noteStart = ref({ x: 0, y: 0 })
const inputRef = ref(null)
const isHovered = ref(false)

// Функция для автоматического изменения ширины
function autoResize() {
  nextTick(() => {
    if (inputRef.value) {
      const tempSpan = document.createElement('span')
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.whiteSpace = 'pre'
      tempSpan.style.font = window.getComputedStyle(inputRef.value).font
      tempSpan.textContent = inputRef.value.value || inputRef.value.placeholder || ''
      document.body.appendChild(tempSpan)
      
      const minWidth = 100 
      const padding = 20 
      const newWidth = Math.max(minWidth, tempSpan.offsetWidth + padding)
      
      document.body.removeChild(tempSpan)
      inputRef.value.style.width = newWidth + 'px'
      
      const noteElement = inputRef.value.closest('.floating-note')
      if (noteElement) {
        noteElement.style.width = newWidth + 'px'
      }
    }
  })
}

// Следим за изменением текста
watch(() => props.note.text, () => {
  autoResize()
})

onMounted(() => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
})

function startDrag(e) {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  noteStart.value = { x: props.note.x, y: props.note.y }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  
  emit('update:note', {
    ...props.note,
    x: noteStart.value.x + dx,
    y: noteStart.value.y + dy
  })
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Обработчик ввода текста
function handleInput(event) {
  emit('update:note', { ...props.note, text: event.target.value })
  autoResize()
}

// Функция для получения стилей тени
function getBoxShadow() {
  if (isDragging.value) {
    return '0 8px 24px rgba(0,0,0,0.3)'
  }
  if (isHovered.value) {
    return '0 4px 12px rgba(0,0,0,0.2)'
  }
  return 'none'
}
</script>

<template>
  <div 
    class="floating-note"
    :style="{ left: note.x + 'px', top: note.y + 'px', boxShadow: getBoxShadow() }"
    @click.right="$emit('remove', note.id)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div 
      class="note-header"
      @mousedown="startDrag"
      :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
    >
      <input
        ref="inputRef"
        :value="note.text"
        @input="handleInput"
        class="note-input"
      />
    </div>
  </div>
</template>

<style scoped>
.floating-note {
  position: absolute;
  z-index: 50;
  min-width: 100px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  user-select: none;
  display: inline-block;
}

.note-header {
  padding: 0.5rem;
  border-radius: 4px;
}

.note-input {
  width: 100px;
  max-width: 580px;
  min-width: 100px;
  min-height: 50px;
  border: none;
  outline: none;
  padding: 10px;
  font-family: Arial;
  font-size: 18px;
  font-weight: bold;
  background: transparent;
  box-sizing: border-box;
  transition: width 0.1s ease;
}

.note-input::placeholder {
  color: #999;
  font-weight: normal;
}
</style>