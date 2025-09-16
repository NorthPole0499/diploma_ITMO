<script setup>
import useDragAndDrop from './useDnD'
import { useEdgesStore } from '@/stores/edges-store';
import { computed } from 'vue'

const emit = defineEmits(['sendOpenClick', 'makeScreenshot', 'copyText'])

const store = useEdgesStore()

function openConsole () {
  emit('sendOpenClick')
}

function makeScreenshot () {
  emit('makeScreenshot')
}

async function copyStory () {
  let text = ''

  for (const command of store.getCommandHistory) {
    text += command + '\n'
  }

  try {
    await navigator.clipboard.writeText(text.slice(0, -1));
    emit('copyText')
  } catch (error) {
    console.error('Ошибка копирования:', error);
  }
}

const { onDragStart } = useDragAndDrop()
</script>

<template>
  <aside style="border-radius: 5%; padding: 2rem; background-color: #98bd4b;">
    <div class="container">
      <div>
        <div class="description" style="display: flex; justify-content: center; font-size: medium;">Выберите желаемую форму для проектирования</div>

        <div class="nodes" style="margin-top: 2rem;">
          <div class="vue-flow__node-input big-button" :draggable="true" @dragstart="onDragStart($event, 'relative')">Relative Node</div>
        
          <div class="vue-flow__node-input big-button" :draggable="true" @dragstart="onDragStart($event, 'relative')">Key-value Node</div>
        
          <div class="vue-flow__node-input big-button" :draggable="true" @dragstart="onDragStart($event, 'relative')">Graph Node</div>
        
          <div class="vue-flow__node-input big-button" :draggable="true" @dragstart="onDragStart($event, 'relative')">Document Node</div>
        
          <div class="vue-flow__node-input big-button" :draggable="true" @dragstart="onDragStart($event, 'relative')">Column Node</div>
        </div>
      </div>

      <div>
        <div class="description" style="display: flex; justify-content: center; font-size: medium;">Обозначения атрибутов в нотации</div>
        <div style="display: flex; justify-content: center;">
          <table>
            <thead>
                <tr>
                    <th>Обозначение</th>
                    <th>Вид атрибута</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>#</td>
                    <td>Ключ</td>
                </tr>
                <tr>
                    <td>!</td>
                    <td>Уникальный атрибут</td>
                </tr>
                <tr>
                    <td>f</td>
                    <td>Внешний ключ</td>
                </tr>
                <tr>
                    <td>+</td>
                    <td>Обязательный атрибут</td>
                </tr>
                <tr>
                    <td>-</td>
                    <td>Не обязательный атрибут</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Атрибут с неустановленным видом</td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>

      <div>
        <div class="vue-flow__node-input big-button" @click="openConsole()" style="cursor: pointer;">
          Открыть консоль редактирования
        </div>
        <div class="vue-flow__node-input big-button" @click="makeScreenshot()" style="margin-top: 1rem; cursor: pointer;">
          Сделать снимок экрана
        </div>
        <div class="vue-flow__node-input big-button" @click="copyStory()" style="margin-top: 1rem; cursor: pointer;">
          Скопировать код создания диаграммы
        </div>
      </div>
    </div>

  </aside>
</template>

<style>
.big-button {
  width: 100%;
  margin-right: 1rem;

  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;          
  justify-content: space-between;
}

.console-button {
  font-size: medium; 
  border-radius: 3%;
  background-color: white;
  padding: 1rem;
  border: solid 1px black;
  cursor: pointer;
  margin-top: 2rem;
}

table {
  border-collapse: collapse;
  margin-top: 0.5rem;
  background-color: whitesmoke;
  border-radius: 5%;
  color: black;
}

th, td {
  border: 1px solid #98bd4b;
  text-align: center;
  padding: 8px;
}

</style>
