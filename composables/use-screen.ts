export const useScreen = () => {
    const screenWidthBreakpoint = {
        'sm': 640,
        'md': 768,
        'lg': 1024,
        'xl': 1280,
        '2xl': 1536
    };

    const screenHeightBreakpoint = {
        'xs': 560,
        'sm': 620,
        'md': 780,
        'lg': 940,
        'xl': 1100,
    };

    const { width, height } = useWindowSize()

    return {
        screenWidthBreakpoint,
        screenHeightBreakpoint,
        width,
        height
    }
}