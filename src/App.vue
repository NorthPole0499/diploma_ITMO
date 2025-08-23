<script setup>
import { ref, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import DropzoneBackground from './DropzoneBackground.vue'
import SideBar from './SideBar.vue'
import useDragAndDrop from './useDnD'
import relativeNode from './nodes/relativeNode.vue'
import EdgeWithButton from './lines/EdgeWithButton.vue'
import consoleBar from './components/consoleBar.vue'

const { onConnect, addEdges, getNodes } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

const nodes = ref([])
const edges = ref([])

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

let showConsole = ref(false)

function openConsole () {
  showConsole.value = true
}

function closeConsole () {
  showConsole.value = false
}

watch(edges.value.length, () => {
  console.log(edges);
});

function connectNodes(nodeId1, nodeId2) {
  const firstNodePosition = getNodes.value.find(item => item.id === nodeId1).position
  const secondNodePosition = getNodes.value.find(item => item.id === nodeId2).position
  const newEdge = {
    source: nodeId1,
    target: nodeId2,
    sourceHandle: firstNodePosition.x > secondNodePosition.x ? 'e' : 'b',
    targetHandle: firstNodePosition.x > secondNodePosition.x ? 'b' : 'e'
  }
  addEdges(newEdge)
}

function build(e) {
  console.log(e)
  addEdges(e)
  console.log(getNodes.value)
}



onConnect(build)
</script>

<template>
  <div class="dnd-flow" @drop="onDrop">
    <VueFlow 
          :nodes="nodes" 
          :edges="edges"
          :edge-types="edgeTypes"
          :default-edge-options="defaultEdgeOptions"
          :connection-radius="25"
          @dragover="onDragOver" 
          @dragleave="onDragLeave"
          @nodes:added="logging">
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      >
        <p v-if="isDragOver">Отпустите</p>
      </DropzoneBackground>

      <template #node-relative="props">
        <relativeNode :id="props.id" :data="props.data" />
      </template>

      <template #edge-button="buttonEdgeProps">
        <EdgeWithButton
          v-bind="buttonEdgeProps"
        />
      </template>
    </VueFlow>

    <SideBar @send-open-click="openConsole"/>
    <div v-if="showConsole" id='overlay' class="overlay"></div>
    <consoleBar v-if="showConsole" @send-close-click="closeConsole"/>
    <button @click="connectNodes('dndnode_0', 'dndnode_1')">Hello</button>
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
</style>
