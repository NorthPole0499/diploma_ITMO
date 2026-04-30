import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'
import { useEdgesStore } from '@/stores/edges-store';

let id = 0
const notes = ref([])
const squares = ref([])

// функция для возвращения id сущности по умолчанию

/**
 * @returns {string}
 */
function getId() {
  return `node_${id++}`
}

// инициализация реактивных переменных

/**
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
}

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()
  const { removeNodes, getEdges, removeEdges } = useVueFlow()

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  // функция для обработки события начала перетаскивания какой-либо сущности

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  // функция для обработки события конца перетаскивания какой-либо сущности

  /**
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function getNodeId() {
    return getId()
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  // функция для обработки момента, когда пользователь отпускает новую сущность на холст
  /**
   * @param {DragEvent} event
   */
  function onDrop(event) {
    if (draggedType.value === 'text') {
      const rect = event.target.getBoundingClientRect()
      notes.value.push({
        id: `note_${Date.now()}`,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        text: ''
      })
      onDragEnd()
      return
    }

    if (draggedType.value === 'square') {
      const rect = event.target.getBoundingClientRect()
      squares.value.push({
        id: `square_${Date.now()}`,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        width: 50,
        height: 50
      })
      onDragEnd()
      return
    }

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId()

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: { label: nodeId },
    }


    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
      }))

      off()
    })

    const store = useEdgesStore()
    store.setCommandHistory('createNode()')

    addNodes(newNode)
  }

  // функция удаления заметки

  function removeNote(noteId) {
    notes.value = notes.value.filter(n => n.id !== noteId)
  }

  // функция удаления квадрата

  function removeSquare(squareId) {
    squares.value = squares.value.filter(s => s.id !== squareId)
  }

  // функция для удаления сущности

  function deleteNodeById(nodeId) {
    const connectedEdges = getEdges.value.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    )
    const edgeIdsToRemove = connectedEdges.map(edge => edge.id)

    if (edgeIdsToRemove.length > 0) {
      removeEdges(edgeIdsToRemove)
    }
    
    removeNodes(nodeId)
  
    const store = useEdgesStore()
    store.setCommandHistory(`removeNode(${nodeId})`)
  }

   // функция для удаления соединения

  function deleteEdgeById(edgeId) {
    removeEdges([edgeId])
    
    const store = useEdgesStore()
    store.setCommandHistory(`removeEdge(${edgeId})`)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
    getNodeId,
    deleteNodeById,
    deleteEdgeById,
    notes,
    removeNote,
    squares,
    removeSquare
  }
}