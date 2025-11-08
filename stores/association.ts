
import {defineStore} from 'pinia'

export const useAssociationStore = defineStore('association', () => {

    const updatedAssociatedCompanyFlag = ref(0);
    const associatedAccountSubscriptionSelectionKey = ref(0);
    const updatedAssociatedAccountSubscriptionFlag = ref(0);

    const associatedUserSubRowSlug = ref('');

    return {
        updatedAssociatedCompanyFlag,
        associatedAccountSubscriptionSelectionKey,
        updatedAssociatedAccountSubscriptionFlag,
        associatedUserSubRowSlug
    }
})