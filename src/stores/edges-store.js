import { defineStore } from "pinia"

export const useEdgesStore = defineStore('edges', {
    state: () => ({
        currentEdge: null,
        currentDocument: null,
        commandHistory: []
    }),
    getters: {
        getCommandHistory(state) {
            return state.commandHistory
        }
    },
    actions: {
        setCurrentEdge (value) {
            this.currentEdge = value
        },
        setCurrentDocument (value) {
            this.currentDocument = value
        },
        setCommandHistory (value) {
            console.log(this.commandHistory)
            this.commandHistory = [...this.commandHistory, value]
        }
    }
})