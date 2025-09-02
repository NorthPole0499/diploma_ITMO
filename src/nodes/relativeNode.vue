<script setup>
import { Handle, Position} from '@vue-flow/core'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

// const { updateNodeData, getConnectedEdges } = useVueFlow()

// function onSelect(color) {
//   updateNodeData(props.id, { color, isGradient: false })

//   const connectedEdges = getConnectedEdges(props.id)
//   for (const edge of connectedEdges) {
//     edge.style = {
//       stroke: color,
//     }
//   }
// }

function resizeTextarea(name) {
      const textarea = document.getElementById('textarea' + name);
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
}
</script>

<template>
  <div class="custom-node">
    <div>
      Node ID: {{ id }}
    </div>
    <textarea 
      :id="'textarea' + props.id + '-name'"
      placeholder="Название элемента"
      @input="resizeTextarea(props.id + '-name')"
      class="block-textarea"
      style="background-color: #ADD8E6; text-align: center;"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-main'"
      placeholder="# имя атрибута: тип"
      @input="resizeTextarea(props.id + '-main')"
      class="block-textarea"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-add'"
      placeholder="неключевые атрибуты"
      @input="resizeTextarea(props.id + '-add')"
      class="block-textarea"
    ></textarea>
  </div>

  <Handle id="a" type="source" :position="Position.Right" style="top: 150px"/>
  <Handle id="b" type="source" :position="Position.Right" />
  <Handle id="c" type="source" :position="Position.Right" style="top: 50px"/>
  <Handle id="d" type="source" :position="Position.Left"  style="top: 150px"/>
  <Handle id="e" type="source" :position="Position.Left" />
  <Handle id="f" type="source" :position="Position.Left" style="top: 50px"/>

  <Handle id="a" type="target" :position="Position.Right" style="top: 150px"/>
  <Handle id="b" type="target" :position="Position.Right" />
  <Handle id="c" type="target" :position="Position.Right" style="top: 50px"/>
  <Handle id="d" type="target" :position="Position.Left"  style="top: 150px"/>
  <Handle id="e" type="target" :position="Position.Left" />
  <Handle id="f" type="target" :position="Position.Left" style="top: 50px"/>
</template>

<style>
.custom-node {
  display: flex;
  flex-direction: column;
  background-color: #ADD8E6;
  height: auto;
  border: 1px solid black;
}

.block-textarea {
  resize: none;
  min-width: 200px;
  min-height: 60px;
  height: auto;
}
</style>
