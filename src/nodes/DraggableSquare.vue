<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  square: Object
})

const emit = defineEmits(['update:square', 'remove'])

const squareRef = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialPos = ref({ x: 0, y: 0 })
const initialSize = ref({ width: 0, height: 0 })
const isHovered = ref(false)
const resizeHandle = ref(null)

// Начало перетаскивания квадрата
function startDrag(e) {
  // Игнорируем, если тянем за ручку изменения размера
  if (e.target === resizeHandle.value) return
  
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  initialPos.value = { x: props.square.x, y: props.square.y }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// Перетаскивание квадрата
function onDrag(e) {
  if (!isDragging.value) return
  
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  
  emit('update:square', {
    ...props.square,
    x: initialPos.value.x + dx,
    y: initialPos.value.y + dy
  })
}

// Остановка перетаскивания
function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Начало изменения размера
function startResize(e) {
  e.stopPropagation()
  e.preventDefault()
  
  isResizing.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  initialSize.value = { 
    width: props.square.width || 50, 
    height: props.square.height || 50 
  }
  initialPos.value = { x: props.square.x, y: props.square.y }
  
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

// Изменение размера
function onResize(e) {
  if (!isResizing.value) return
  
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  
  const newWidth = Math.max(30, initialSize.value.width + dx) // Минимальный размер 30px
  const newHeight = Math.max(30, initialSize.value.height + dy)
  
  emit('update:square', {
    ...props.square,
    width: newWidth,
    height: newHeight
  })
}

// Остановка изменения размера
function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

// Удаление квадрата
function removeSquare(e) {
  e.stopPropagation()
  emit('remove', props.square.id)
}

// Очистка слушателей при уничтожении компонента
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

// Получение стилей тени
function getBoxShadow() {
  if (isDragging.value || isResizing.value) {
    return '0 8px 24px rgba(0,0,0,0.3)'
  }
  if (isHovered.value) {
    return '0 4px 12px rgba(0,0,0,0.2)'
  }
  return 'none'
}

// Получение курсора
function getCursor() {
  if (isDragging.value) return 'grabbing'
  if (isResizing.value) return 'nwse-resize'
  return 'grab'
}
</script>

<template>
  <div 
    ref="squareRef"
    class="draggable-square"
    :style="{ 
      left: square.x + 'px', 
      top: square.y + 'px',
      width: (square.width || 50) + 'px',
      height: (square.height || 50) + 'px',
      boxShadow: getBoxShadow(),
      cursor: getCursor()
    }"
    @mousedown="startDrag"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click.right.prevent="removeSquare"
  >
    <!-- Кнопка удаления -->
    <button 
      class="remove-btn"
      @click="removeSquare"
      @mousedown.stop
      title="Удалить"
    >
      ×
    </button>
    
    <!-- Ручка для изменения размера -->
    <div 
      ref="resizeHandle"
      class="resize-handle"
      @mousedown="startResize"
      @mouseenter="isHovered = true"
    >
      <svg width="10" height="10" viewBox="0 0 10 10">
        <line x1="8" y1="10" x2="10" y2="8" stroke="#999" stroke-width="1"/>
        <line x1="4" y1="10" x2="10" y2="4" stroke="#999" stroke-width="1"/>
        <line x1="0" y1="10" x2="10" y2="0" stroke="#999" stroke-width="1"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.draggable-square {
  position: absolute;
  z-index: 40;
  border: 1px solid black;
  background: transparent;
  transition: box-shadow 0.2s ease;
  user-select: none;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: white;
  color: #666;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.draggable-square:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: #ff4444;
  color: white;
  border-color: #ff4444;
}

.resize-handle {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  cursor: nwse-resize;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draggable-square:hover .resize-handle {
  opacity: 1;
}
</style>