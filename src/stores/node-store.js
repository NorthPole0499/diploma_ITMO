import { defineStore } from "pinia"

export const useNodeStore = defineStore('nodes', {
    state: () => ({
        currentNodeField: null
    }),
    getters: {
        
    },
    actions: {
        setCurrentNodeField (value) {
            this.currentNodeField = value
        }
    }
})