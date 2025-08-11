import { tabs, currentTab } from "../../../stores/store"
import type { Writable } from "svelte/store";

export function handleInput(event: KeyboardEvent) {
    if (event.metaKey) {
        if ("0123456789".includes(event.key)) {
            const gotoTab: number = parseInt(event.key) - 1;
            let tabsValue: [string, string, number][] = [];
            tabs.subscribe(value => tabsValue = value)();
            if (tabsValue && tabsValue.length > gotoTab) {
                currentTab.set(gotoTab);
            }
        }
    }

    if (event.ctrlKey) {
        let gotoTab: number = getTab(currentTab);
        if (event.key === "Tab") {
            if (event.shiftKey) {
                gotoTab--;
            } else {
                gotoTab++;
            }

            let tabsValue: [string, string, number][] = [];
            tabs.subscribe(value => tabsValue = value)();
            if (gotoTab >= 0 && tabsValue.length > gotoTab) {
                currentTab.set(gotoTab);
            } else if (gotoTab < 0) {
                currentTab.set(tabsValue.length - 1);
            } else {
                currentTab.set(0);
            }
        }
    }
}

function getTab(currentTab: Writable<number>): number {
    let value: number;
    currentTab.subscribe(v => value = v)();
    return value!;
}
