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
      console.log(textarea.scrollHeight)
      textarea.style.height = textarea.scrollHeight + 'px';
}
</script>

<template>
  <div style="display: flex; flex-direction: column; background-color: #ADD8E6; height: auto;">
    <div>
      Node ID: {{ id }}
    </div>
    <textarea 
      :id="'textarea' + props.id + '-name'"
      placeholder="Название элемента"
      @input="resizeTextarea(props.id + '-name')"
      style="background-color: #ADD8E6;
        resize: none;
        min-width:200px;
        min-height: 60px;
        height: auto; 
        text-align: center;"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-main'"
      placeholder="# имя атрибута: тип"
      @input="resizeTextarea(props.id + '-main')"
      style="
        resize: none;
        min-width:200px;
        min-height: 60px;
        height: auto;"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-add'"
      placeholder="неключевые атрибуты"
      @input="resizeTextarea(props.id + '-add')"
      style="
        resize: none;
        min-width:200px;
        min-height: 60px;
        height: auto;"
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
