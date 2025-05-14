
export type NavigationLinkInterface = {
    type: 'link' | 'action' | 'anchor-link' | 'drop';
    title: string;
    to?: string;
    icon?: string;
    route?: string;
    options?: NavigationLinkInterface[];
    callback?: () => void;
}