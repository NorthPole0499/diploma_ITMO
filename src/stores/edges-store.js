import { defineStore } from "pinia"

export const useEdgesStore = defineStore('edges', {
    state: () => ({
        currentEdge: null
    }),
    actions: {
        setCurrentEdge (value) {
            this.currentEdge = value
        }
    }
})