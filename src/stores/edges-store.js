import { defineStore } from "pinia"

export const useEdgesStore = defineStore('edges', {
    state: () => ({
        currentEdge: null,
        currentDocument: null
    }),
    actions: {
        setCurrentEdge (value) {
            this.currentEdge = value
        },
        setCurrentDocument (value) {
            this.currentDocument = value
        }
    }
})