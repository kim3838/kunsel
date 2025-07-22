
import {defineStore} from 'pinia'

export const useAssociationStore = defineStore('association', () => {

    const updatedAssociatedCompanyFlag = ref(0);
    const associatedUserSubRowSlug = ref('');

    return {
        updatedAssociatedCompanyFlag,
        associatedUserSubRowSlug
    }
})