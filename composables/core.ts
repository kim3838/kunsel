
export const useClientReadyState = () => {
    return useState ('client-ready', () => false);
};

export const deviceState = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Check for mobile devices
    if (/android/i.test(userAgent)) {
        return "Android Mobile";
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return "iOS Device";
    }
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    // Check for tablets
    if (/iPad|Android/.test(userAgent) && !/Mobile/.test(userAgent)) {
        return "Tablet";
    }

    // Default to desktop
    return "Desktop";
}

export const isDesktop = () => deviceState() === 'Desktop';