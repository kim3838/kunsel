export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){

        if(import.meta.server){

            const {ssrFetchAssociatedCompanies, ssrFetchIsAdminInAnyCompany} = useAssociation();
            const {isAuthenticated} = useAuth();

            if(isAuthenticated.value){
                await ssrFetchAssociatedCompanies();
                await ssrFetchIsAdminInAnyCompany();
            }
        }
    },
});