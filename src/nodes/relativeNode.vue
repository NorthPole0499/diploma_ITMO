<script setup>
import { Handle, Position} from '@vue-flow/core'
import { ref, watch, computed } from 'vue'
import { useNodeStore } from '@/stores/node-store'
import { useEdgesStore } from '@/stores/edges-store'

// устанавливаем необходимые импорты, инициализируем реактивные переменные и входные атрибуты

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


let titleNode = ref(null)
let keyNode = ref(null)
let noneKeyNode = ref(null)

const store = useNodeStore()
const currentNodeField = computed(() => store.currentNodeField)

// функция, отслеживающая изменение состояния блоков, которая обновляет их содержимое при обновлении их консолью
watch(currentNodeField, (newValue, oldValue) => {
  if (props.id == newValue.id) {
    switch (newValue.field) {
      case 'title':
        titleNode.value = newValue.value
        break
      case 'key':
        keyNode.value = newValue.value
        break
      case 'noneKey':
        noneKeyNode.value = newValue.value
        break
      default:
        noneKeyNode.value = newValue.value
        break
    }
  }
})

// функция, адаптивно изменяющая размер текстового поля при вводе информации

function resizeTextarea(name) {
      const textarea = document.getElementById('textarea' + name);
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
}

const edgeStore = useEdgesStore()

// функция для записи истории изменения ноды в логи

function putInCommandHistory (field, value) {
  edgeStore.setCommandHistory('changeNodeField(' + props.id + ', ' + field +  ', ' + value + ')')
}
</script>

<template>
  <div class="custom-node">
    <div>
      Node ID: <span style="text-transform: none;">{{ id }}</span>
    </div>
    <textarea 
      :id="'textarea' + props.id + '-name'"
      placeholder="Название элемента"
      v-model="titleNode"
      @input="resizeTextarea(props.id + '-name')"
      @change="putInCommandHistory('title', titleNode)"
      class="block-textarea"
      style="background-color: #ADD8E6; text-align: center;"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-main'"
      v-model="keyNode"
      placeholder="# имя атрибута: тип"
      @input="resizeTextarea(props.id + '-main')"
      @change="putInCommandHistory('key', keyNode)"
      class="block-textarea"
    ></textarea>
    <textarea 
      :id="'textarea' + props.id + '-add'"
      v-model="noneKeyNode"
      placeholder="неключевые атрибуты"
      @input="resizeTextarea(props.id + '-add')"
      @change="putInCommandHistory('noneKey', noneKeyNode)"
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
