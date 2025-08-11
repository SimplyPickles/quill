import { writable } from 'svelte/store';

export const tabs = writable<[string, string, number][]>([]);
export const currentTab = writable(0);
export const preventOpen = writable<Element | undefined>(undefined);