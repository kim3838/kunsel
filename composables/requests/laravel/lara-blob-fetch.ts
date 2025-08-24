
export type laraBlobFetchT = {
    path: string;
    filename?: string | null;
    action?: 'download' | 'view';
};

export async function laraBlobFetch(
    {
        path,
        filename = 'download',
        action = 'download'
    }: laraBlobFetchT,
    callbacks: any = {},
    promptErrorResponse = true,
){

    const {baseURL} = useRuntimeConfig().public;
    const coreStore = useCoreStore();
    filename = _isEmpty(filename)|| filename === null
        ? 'download'
        : filename;

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

                const disposition = response.headers.get('content-disposition');

                let responseFilename = null;

                if (disposition && disposition.includes('filename=')) {

                    const parts = disposition.split('filename=');

                    if (parts.length > 1) {
                        responseFilename = disposition.split('filename=')[1]?.replace(/"/g, '') ?? null;
                    }
                }

                const blob = response._data; // Response _data is already a blob if responseType: 'blob'
                const url = URL.createObjectURL(blob);

                if (action === 'view') {
                    // Display in new tab
                    window.open(url, '_blank');
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } else {
                    // Download file
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = _isEmpty(responseFilename) || responseFilename === null
                        ? filename
                        : responseFilename;

                    link.addEventListener('click', () => {
                        setTimeout(() => URL.revokeObjectURL(link.href), 100);
                    }, { once: true });

                    link.click();
                }
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