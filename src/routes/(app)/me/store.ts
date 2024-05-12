import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const getPageTitleStore = () => getContext<Writable<string>>('pageTitle');
export const setPageTitleStore = () => setContext('pageTitle', writable<string>(''));

export const getMenuStore = () => getContext<Writable<boolean>>('menu');
export const setMenuStore = () => setContext<Writable<boolean>>('menu', writable(false));
