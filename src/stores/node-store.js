import { defineStore } from "pinia"

// определение хранилища состояний для работы с сущностями

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