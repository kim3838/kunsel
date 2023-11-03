import {useWindowSize } from '@vueuse/core'

export const useScreen = () => {
    const screens = {
        'sm': 640,
        'md': 768,
        'lg': 1024,
        'xl': 1280,
        '2xl': 1536
    };

    const { width, height } = useWindowSize()

    return {
        screens,
        width,
        height
    }
}