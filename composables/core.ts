
export const useRouteTo = () => {
    return useState ('route-to', () => {return {};});
};

export const useClientReadyState = () => {
    return useState ('client-ready', () => false);
};