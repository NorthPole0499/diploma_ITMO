<script setup>
import { ref, nextTick } from 'vue';
import useDragAndDrop from '../useDnD';
import { useVueFlow } from '@vue-flow/core'

const { getNodeId } = useDragAndDrop()
const { addNodes, addEdges, getNodes } = useVueFlow()

const currentCommand = ref('');
const commandHistory = ref([]);
const output = ref(null);

const emit = defineEmits(['sendCloseClick'])

function closeConsole () {
  emit('sendCloseClick')
}

const executeCommand = () => {
  if (!currentCommand.value.trim()) return;
  
  commandHistory.value.push({
    command: currentCommand.value,
    output: getCommandOutput(currentCommand.value)
  });
  
  currentCommand.value = '';
  scrollToBottom();
};

const getCommandOutput = (command) => {
  if (command == undefined || !command.includes('(')) {
    return 'Неизвестная команда. <br>Введите <span class="console-code">help()</span> для получения справки о доступных командах.'
  }
  const commandHeader = command.split('(')[0]
  const commandBody = command.split('(')[1].slice(0, -1).split(',')
  if (commandHeader === 'help') {
    return "Для получения информации о всех возможных командах перейдите в <a href='https://clck.ru/3NVCx4' target='_blank'>документацию.</a>";
  }
  else if (commandHeader === 'clearConsole') {
    commandHistory.value = [];
    return '';
  } else if (commandHeader === 'createNode') {
    let currentId = null
    currentId = getNodeId()
    if (commandBody[0] != '') {
      currentId = commandBody[0].trim()
    }
    const newNode = {
    id: currentId,
    type: 'relative',
    position: { x: Math.random() * 300, y: Math.random() * 300 },
    data: { label: currentId }
    }
    addNodes(newNode)
    return `Добавлена сущность с id: ${currentId}`;
  } else if (commandHeader === 'createConnection') {
    if (commandBody.length < 2) {
      return 'Не введены обязательные параметры. Необходимо ввести 2 id сущностей.'
    } else {
      const nodeId1 = commandBody[0].trim()
      const nodeId2 = commandBody[1].trim()
      const firstNodePosition = getNodes.value.find(item => item.id === nodeId1)?.position
      if (!firstNodePosition) {
        return `Не существует сущности с id: ${nodeId1}`
      }
      const secondNodePosition = getNodes.value.find(item => item.id === nodeId2)?.position
      if (!secondNodePosition) {
        return `Не существует сущности с id: ${nodeId2}`
      }

      const newEdge = {
        source: nodeId1,
        target: nodeId2,
        sourceHandle: firstNodePosition.x > secondNodePosition.x ? 'e' : 'b',
        targetHandle: firstNodePosition.x > secondNodePosition.x ? 'b' : 'e'
      }
      addEdges(newEdge)

      return `Соединены сущности ${nodeId1} и ${nodeId2}`
    }
  } else if (commandHeader === 'changeConnection') {
    console.log(props.specialRef)
  } else {
    return 'Неизвестная команда. <br>Введите <span class="console-code">help()</span> для получения справки о доступных командах.'
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (output.value) {
      output.value.scrollTop = output.value.scrollHeight;
    }
  });
};

</script>

<template>
  <div class="console">
    <button class="top-right-button" @click="closeConsole">
      <img src="../../static/images/back.png" alt="back" class="back-button-image"/>
    </button>

    <a class="top-left-button" href="https://clck.ru/3NVCx4" target="_blank">
      <img src="../../static/images/book.png" alt="back" class="library-image"/>
    </a>

    <div ref="output" class="console-output">
      <div v-for="(entry, index) in commandHistory" :key="index" class="command-entry">
        <span class="user-prompt">user.command:-></span> <span class="console-code">{{ entry.command }}</span>
        <p v-if="entry.output" class="command-output" v-html="entry.output"></p>
      </div>
    </div> 

    <div class="case-input">
      <input 
        v-model="currentCommand"
        type="text" class="field-input" 
        placeholder="Введите текст..." 
        @keyup.enter="executeCommand">
      <button class="button-input" @click="executeCommand">></button>
    </div>
  </div>
</template>

<style>
.console {
  position: fixed;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  z-index: 1500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5%; 
  padding: 2rem;
  background-color: #98bd4b;
}

.console-output {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 4rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-family: monospace;
  color: white;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
  height: 75%;
}

.command-entry {
  margin-bottom: 0.5rem;
  text-align: left;
}

.user-prompt {
  color: black;
  font-weight: bold;
}

.console-code {
  text-transform: none;
}

.command-output {
  margin-top: 0.5rem;
  color: #f8f8f8;
  line-height: 1.5;
}

.top-right-button {
  position: absolute;
  top: 20px; 
  right: 20px; 
  border: none;
  background-color: #98bd4b;
  cursor: pointer;
}

.top-left-button {
  position: absolute;
  top: 20px; 
  left: 30px; 
  border: none;
  background-color: #98bd4b;
  cursor: pointer;
}

.case-input {
  position: absolute;
  bottom: 100px; 
  width: 90%;
  height: 2rem;
  display: flex;
  align-items: stretch;
}

.field-input {
  flex: 1;
  height: 100%;
  padding: 0 10px;
  border: none; 
  border-radius: 4px 0 0 4px; 
}

.button-input {
  width: 2.5rem;
  height: 100%; 
  border: none; 
  background: whitesmoke;
  color: black; 
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.back-button-image {
  transform: rotate(180deg);
  height: 1.5rem;
  width: 1.5rem;
}

.library-image {
  height: 1.75rem;
  width: 1.75rem;
}
</style>
