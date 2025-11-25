import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'
import { useEdgesStore } from '@/stores/edges-store';

let id = 0

/**
 * @returns {string}
 */
function getId() {
  return `node_${id++}`
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * The type of the node being dragged.
   */
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

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drag over event.
   *
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

  /**
   * Handles the drop event.
   *
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

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
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