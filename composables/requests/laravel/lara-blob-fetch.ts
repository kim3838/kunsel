
export async function laraBlobFetch(
    path: string,
    filename = 'download',
    mimeType = 'application/octet-stream',
    callbacks: any = {},
    promptErrorResponse = true
){

    const {baseURL} = useRuntimeConfig().public;
    const coreStore = useCoreStore();

    const response = await $fetch.raw(baseURL + path, {
        credentials: 'include',
        responseType: 'blob',
        headers: {
            ...laraHeaders()
        },
        async onRequest({request, options}){

            if(callbacks.onRequest && typeof callbacks.onRequest == 'function'){
                await callbacks.onRequest(request, options);
            }

            coreStore.resetServiceError();
        },
        async onResponse({request, options, response}) {

            let responseCode: number = _isEmpty(response) ? 0 : response.status;

            if(callbacks.onResponse && typeof callbacks.onResponse == 'function'){
                await callbacks.onResponse(response);
            }

            if(responseCode == 200){
                if(callbacks.onSuccessResponse && typeof callbacks.onSuccessResponse == 'function'){
                    await callbacks.onSuccessResponse(response);
                }

                const blob = new Blob([response._data], { type: mimeType })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = filename
                link.click()

                // Clean up memory
                URL.revokeObjectURL(link.href)
            }
        }
    }).catch(async (error) => {

        if(callbacks.onRequestError && typeof callbacks.onRequestError == 'function'){
            await callbacks.onRequestError(error);
        }

        coreStore.setServiceError({
            prompt: promptErrorResponse,
            icon: 'mdi:information-variant-circle-outline',
            title: 'Request failed',
            payload: {
                message: error?.statusMessage ?? null
            }
        });
    });
}