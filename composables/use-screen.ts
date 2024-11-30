export const useScreen = () => {
    const screenWidthBreakpoint = {
        'sm': 640,
        'md': 768,
        'lg': 1024,
        'xl': 1280,
        '2xl': 1536
    };

    const screenHeightBreakpoint = {
        'sm': 680,
        'md': 780,
        'lg': 940
    };

    const { width, height } = useWindowSize()

    return {
        screenWidthBreakpoint,
        screenHeightBreakpoint,
        width,
        height
    }
}