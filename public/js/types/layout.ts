
export type NavigationLinkInterface = {
    type: 'link' | 'action' | 'anchor-link' | 'drop' | 'sub-nav';
    drop_align?: string;
    title: string;
    key: string;
    to?: string;
    icon?: string;
    route_active?: string;
    path_active?: string;
    options?: NavigationLinkInterface[];
    callback?: () => void;
}