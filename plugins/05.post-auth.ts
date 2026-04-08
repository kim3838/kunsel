export default defineNuxtPlugin({
    enforce: 'pre',

    async setup(nuxtApp){

        if(import.meta.server){

            const {ssrFetchAssociatedCompanies, ssrFetchUserIsAdminInAnyCompany} = useAssociation();
            const {setStoredThemeType} = useCommon();
            const {isAuthenticated} = useAuth();

            if(isAuthenticated.value){
                await ssrFetchAssociatedCompanies();
                await ssrFetchUserIsAdminInAnyCompany();

                setStoredThemeType();
            }
        }
    },
});