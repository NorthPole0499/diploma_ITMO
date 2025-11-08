<script setup>
import { ref, watch, computed } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@vue-flow/core'
import { useEdgesStore } from '@/stores/edges-store'
import radically01 from './radically01.vue'
import radicallyOnly1 from './radicallyOnly1.vue'
import radically0M from './radically0M.vue'
import radically1M from './radically1M.vue'
import radicallyN from './radicallyN.vue'

// устанавливаем необходимые импорты, инициализируем реактивные переменные

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  borderRadius: {
    type: Number,
    required: true,
  },
  offset: {
    type: Number,
    required: true,
  }
})

let leftType = ref(0)
let rightType = ref(0)
let activeMenu = ref(false)

let leftDocument = ref(false)
let rightDocument = ref(false)

// const { removeEdges } = useVueFlow()

const path = computed(() => getSmoothStepPath(props))

// const inverted = computed(() => {
//   return props.sourceX < props.targetX
// })

const store = useEdgesStore()
const neededEdge = computed(() => store.currentEdge)

// функция, остлеживающая состояние хранилища состояний, и обрабатывающая ввод изменения соединения в консоль

watch(neededEdge, (newValue, oldValue) => {
  const splittedIds = props.id.split('-')
  const currentIds = [splittedIds[1].slice(0, -1), splittedIds[2].slice(0, -1)]

  if (currentIds.includes(newValue.first) && currentIds.includes(newValue.second)) {
    setType(newValue.side, newValue.connection)
  }
})

const neededDocument = computed(() => store.currentDocument)

// функция, остлеживающая состояние хранилища состояний, и обрабатывающая ввод изменения типа документа в консоль

watch(neededDocument, (newValue, oldValue) => {
  const splittedIds = props.id.split('-')
  const currentIds = [splittedIds[1].slice(0, -1), splittedIds[2].slice(0, -1)]

  if (currentIds.includes(newValue.first) && currentIds.includes(newValue.second)) {
    setDocument(newValue.side)
  }
})

// функция, возвращающая координаты кнопки, исходя из ее позиции
const getButtonPosition = (index) => {
  const isSourceLeft = props.sourceX < props.targetX
  
  if (index === 0) {
    return {
      x: isSourceLeft ? props.sourceX : props.targetX,
      y: isSourceLeft ? props.sourceY : props.targetY
    }
  } else {
    return {
      x: isSourceLeft ? props.targetX : props.sourceX,
      y: isSourceLeft ? props.targetY : props.sourceY
    }
  }
}

// блок функций, которые реализауют выпадающее меню после нажатие на соединение

const ToggleMenu = (index) => {
    const menu = index === 'left' ? document.getElementById('leftDropdown' + props.id) : document.getElementById('rightDropdown' + props.id)
    menu.style.display = menu.style.display === "block" ? 'none' : 'block'
    activeMenu.value = true
}

const typesMap = {0: '0...1', 1: 'only_1', 2: '0...M', 3: '1...M', 4: 'only_N'}

const setType = (side, value) => {
  const splittedIds = props.id.split('-')
  const currentIds = [splittedIds[1].slice(0, -1), splittedIds[2].slice(0, -1)]
  const idsString = side == 'right' ? currentIds[0] + ', ' + currentIds[1] : currentIds[1] + ', ' + currentIds[0]
  store.setCommandHistory('changeConnection(' + idsString + ', ' + typesMap[value] + ')')

  if (side === 'left') {
    const oldButton = document.getElementById('leftButton-' + leftType.value + '-' + props.id)
    oldButton.style.backgroundColor = 'rgb(255, 255, 255)'
    const button = document.getElementById('leftButton-' + value + '-' + props.id)
    button.style.backgroundColor = 'rgb(232, 238, 220)'
    leftType.value = value
  } else {
    const oldButton = document.getElementById('rightButton-' + rightType.value + '-' + props.id)
    oldButton.style.backgroundColor = 'rgb(255, 255, 255)'
    const button = document.getElementById('rightButton-' + value + '-' + props.id)
    button.style.backgroundColor = 'rgb(232, 238, 220)'
    rightType.value = value
  }
}

const setDocument = (side) => {
  const splittedIds = props.id.split('-')
  const currentIds = [splittedIds[1].slice(0, -1), splittedIds[2].slice(0, -1)]
  const idsString = side == 'right' ? currentIds[0] + ', ' + currentIds[1] : currentIds[1] + ', ' + currentIds[0]
  store.setCommandHistory('changeDocument(' + idsString + ')')

  if (side === 'left') {
    const button = document.getElementById('leftDocument-' + props.id)
    if (leftDocument.value) {
      button.style.backgroundColor = 'rgb(255, 255, 255)'
    } else {
      button.style.backgroundColor = 'rgb(173, 216, 230)'
    }
    leftDocument.value = !leftDocument.value
  } else {
    const button = document.getElementById('rightDocument-' + props.id)
    if (rightDocument.value) {
      button.style.backgroundColor = 'rgb(255, 255, 255)'
    } else {
      button.style.backgroundColor = 'rgb(173, 216, 230)'
    }
    rightDocument.value = !rightDocument.value
  }
}

</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseEdge :id="id" :style="style" style="stroke: #000" :path="path[0]" :marker-end="markerEnd"/>

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-5%, -45%) translate(${getButtonPosition(0).x}px,${getButtonPosition(0).y}px)`,
      }"
      class="nodrag nopan"
      @click="ToggleMenu('left')"
    >
      <radicallyOnly1 v-if="leftType === 0" :inversed="true" :document="leftDocument"/>
      <radically01 v-else-if="leftType === 1" :inversed="true" :document="leftDocument"/>
      <radically0M v-else-if="leftType === 2" :inversed="true" :document="leftDocument"/>
      <radically1M v-else-if="leftType === 3" :inversed="true" :document="leftDocument"/>
      <radicallyN v-else :inversed="true" :document="leftDocument"/>

      <div :id="'leftDropdown' + id" class="dropdown-content" style="transform: translate(40%, 10%)">
        <div style="padding: 0.5rem;">
          <button :id="'leftButton-0-' + id" class="edge-button" @click="setType('left', 0)" style="background-color: rgb(232, 238, 220);">0...1</button>
          <button :id="'leftButton-1-' + id" class="edge-button" @click="setType('left', 1)">Только 1</button>
          <button :id="'leftButton-2-' + id" class="edge-button" @click="setType('left', 2)">0...M</button>
          <button :id="'leftButton-3-' + id" class="edge-button" @click="setType('left', 3)">1...M</button>
          <button :id="'leftButton-4-' + id" class="edge-button" @click="setType('left', 4)">Только N</button>
          <button :id="'leftDocument-' + id" class="edge-button" @click="setDocument('left')">Документ</button>
        </div>
      </div>
    </div>

    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-95%, -45%) translate(${getButtonPosition(1).x}px,${getButtonPosition(1).y}px)`,
      }"
      class="nodrag nopan"
      @click="ToggleMenu('right')"
    >
      <radicallyOnly1 v-if="rightType === 0" :document="rightDocument"/>
      <radically01 v-if="rightType === 1" :document="rightDocument"/>
      <radically0M v-if="rightType === 2" :document="rightDocument"/>
      <radically1M v-if="rightType === 3" :document="rightDocument"/>
      <radicallyN v-if="rightType === 4" :document="rightDocument"/>

      <div :id="'rightDropdown' + id" class="dropdown-content" style="transform: translate(-80%, 10%)">
        <div style="padding: 0.5rem;">
          <button :id="'rightButton-0-' + id" class="edge-button" @click="setType('right', 0)" style="background-color: rgb(232, 238, 220);">0...1</button>
          <button :id="'rightButton-1-' + id" class="edge-button" @click="setType('right', 1)">Только 1</button>
          <button :id="'rightButton-2-' + id" class="edge-button" @click="setType('right', 2)">0...M</button>
          <button :id="'rightButton-3-' + id" class="edge-button" @click="setType('right', 3)">1...M</button>
          <button :id="'rightButton-4-' + id" class="edge-button" @click="setType('right', 4)">Только N</button>
          <button :id="'rightDocument-' + id" class="edge-button" @click="setDocument('right')">Документ</button>
        </div>
      </div>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edge-button {
  width: 100%;
  margin-bottom: 0.25rem;
  background-color: white;
  border: 1px solid gray;
  border-radius: 8%;
}

.submit-button {
  width: 100%;
  margin-bottom: 0.25rem;
  background-color: rgb(232, 238, 220);
  border: 0px solid gray;
  border-radius: 8%;
}

.dropdown-content {
  border-radius: 5%;
  min-width: 80px;
  display: flex; 
  flex-direction: column;
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #000;
}
</style>
