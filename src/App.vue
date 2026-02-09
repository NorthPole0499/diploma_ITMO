<script setup>
import { ref, watch, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import DropzoneBackground from './DropzoneBackground.vue'
import SideBar from './SideBar.vue'
import useDragAndDrop from './useDnD'
import relativeNode from './nodes/relativeNode.vue'
import EdgeWithButton from './lines/EdgeWithButton.vue'
import consoleBar from './components/consoleBar.vue'
import toastInfo from './components/toastInfo.vue'
import html2canvas from 'html2canvas'
import { useEdgesStore } from '@/stores/edges-store'


// устанавливаем необходимые импорты, инициализируем реактивные переменные

const { onConnect, addEdges, getNodes } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

const nodes = ref([])
const edges = ref([])

const screenWidth = ref(screen.width)
const screenHeight = ref(screen.height)

const edgeTypes = {
  'button': EdgeWithButton
}

const defaultEdgeOptions = {
  type: 'button',
  pathOptions: {
    borderRadius: 5,
    offset: 10
  }
}

// блок функций для открытия и закрытия консоли

let showConsole = ref(false)

function openConsole () {
  showConsole.value = true
}

function closeConsole () {
  showConsole.value = false
}

// блок функций для создания скриншота диаграммы

const capture = ref(null)
const targetCanvas = ref(null)
let showIndicator = ref(false)

async function takeScreenshot () {
  try {
    if (!capture.value) {
      return;
    }

    showIndicator.value = true

    await nextTick()

    var svgElements = document.body.querySelectorAll('svg');
    svgElements.forEach(function(item) {
      item.setAttribute("width", item.getBoundingClientRect().width);
      item.setAttribute("height", item.getBoundingClientRect().height);
      item.style.width = null;
      item.style.height= null;
    });

    const canvas = await html2canvas(capture.value, {
      width: screen.width - 500,
      height: screen.height - 80,
      useCORS: true,
      allowTaint: false,
      scale: 2,
      backgroundColor: '#FFFFFF'
    });
        
    const link = document.createElement('a');
    link.download = 'diagram-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showIndicator.value = false

    currentType.value = 'image'
    showToast.value = true
  } catch (error) {
    console.error('Ошибка при создании скриншота:', error);
    showIndicator.value = false
  }
}

// блок функций для копирования кода диаграммы 

let currentType = ref('text')
let showToast = ref(false)

function copyText () {
  currentType.value = 'text'
  showToast.value = true
}

// функция для логгирования созданий соединений
function addEdgesWithStore (e) {
  const store = useEdgesStore()
  store.setCommandHistory('createConnection(' + e.target + ', ' + e.source + ', 0...1, 0...1, ' + e.targetHandle + ', ' + e.sourceHandle + ')')
  addEdges(e)
}

onConnect(addEdgesWithStore)
</script>

<template>
  <div class="dnd-flow" @drop="onDrop" style="overflow-x: none !important;">
    <div ref="capture" >
    <VueFlow
          :nodes="nodes" 
          :edges="edges"
          :edge-types="edgeTypes"
          :default-edge-options="defaultEdgeOptions"
          :connection-radius="25"
          @dragover="onDragOver" 
          @dragleave="onDragLeave">
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      >
        <p v-if="isDragOver">Отпустите</p>
      </DropzoneBackground>

      <div v-if="showIndicator" class="multimodel-indicator">[[[M]]]</div>

      <template #node-relative="props">
        <relativeNode :id="props.id" :data="props.data" />
      </template>

      <template #edge-button="buttonEdgeProps">
        <EdgeWithButton
          v-bind="buttonEdgeProps"
        />
      </template>

      <canvas ref="targetCanvas" :width="screenWidth - 500" :height="screenHeight - 80"></canvas>
    </VueFlow>
    </div>

    <SideBar @send-open-click="openConsole" @make-screenshot="takeScreenshot" @copy-text="copyText" style="margin: 0.75rem;"/>
    <div v-if="showConsole" id='overlay' class="overlay"></div>
    <consoleBar v-if="showConsole" @send-close-click="closeConsole"/>

    <toastInfo v-if="showToast" :type="currentType" @close-toast="showToast = false" />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.multimodel-indicator {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 30px;
  padding: 10px;
  font-weight: bold;
  color: black;
}
</style>
