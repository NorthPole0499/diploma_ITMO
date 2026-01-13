import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'
import { useEdgesStore } from '@/stores/edges-store';

let id = 0

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
    deleteEdgeById
  }
}