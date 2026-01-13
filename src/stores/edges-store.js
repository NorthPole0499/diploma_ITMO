import { defineStore } from "pinia"

// определение хранилища состояний для работы с соединениями и историей сохранений

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
            this.commandHistory = [...this.commandHistory, value]
        }
    }
})