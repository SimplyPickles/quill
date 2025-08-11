<script lang="ts">
    import { onMount, tick } from "svelte";
    import { BaseDirectory } from '@tauri-apps/api/path';
    import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
    import { tabs, preventOpen } from "../../stores/store"
    import Muuri from "muuri";
    
    import Search from "./search.svelte";
    import Tab from "./tab.svelte"
    import Grid from "muuri";

    import { setupWindowControls } from "./scripts/windowControl";
    import { readDir } from "@tauri-apps/plugin-fs";
    import { generateTitle } from "./scripts/randomTitle";
    import { handleInput } from "./scripts/keyboardShortcuts";

    document.body.onkeydown = (event: KeyboardEvent): void => {
        handleInput(event);
    };

    let grid: Grid;
    onMount(async (): Promise<void> => {
        let sidebar: HTMLDivElement = document.getElementById("sidebar") as HTMLDivElement;
        setupWindowControls(sidebar);

        const entries = await readDir('', { baseDir: BaseDirectory.AppData });
        $tabs = [];
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isFile) {
                let title: string = (await readTextFile(entries[i].name, {
                    baseDir: BaseDirectory.AppData
                })).split("\n")[0].replace("#", "").trim();

                $tabs.push([title, entries[i].name.replace(".md", ""), 0]);
            }
        }
        
        $tabs = $tabs;

        await tick();

        grid = new Muuri("#buttons", {
            dragEnabled: true,
            layout: {
                fillGaps: false,
                horizontal: false
            },

            dragSort: function () {
                return [this];
            },
            
            dragAxis: 'y'
        });
    });

    async function newTab() {
        const id: string = crypto.randomUUID();
        const title: string = generateTitle();

        await writeTextFile(`${id}.md`, title, {
            baseDir: BaseDirectory.AppLocalData
        });
        
        $tabs.push([title, id, 0]);
        $tabs = $tabs;

        const buttons: HTMLDivElement = document.getElementById("buttons") as HTMLDivElement;
        
        setTimeout(() => {
            const elements = buttons.children;
            for (let i = 0; i < elements.length; i++) {
                const element: HTMLElement = elements[i] as HTMLElement;
                if (!isElementInMuuriGrid(grid, element)) {
                    grid.add(element);
                    grid.layout(true);
                    console.log("a");
                }
            }
        }, 1);
    }

    function isElementInMuuriGrid(grid: Grid, element: HTMLElement) {
        const items = grid.getItems();
        for (let i = 0; i < items.length; i++) {
            if (items[i].getElement() === element) {
                return true;
            }
        }

        return false;
    }

    $: if ($preventOpen) {
        const items = grid.getItems();
        for (let i = 0; i < items.length; i++) {
            const element = items[i].getElement()?.children[0] as HTMLElement;
            if (element === $preventOpen) {
                console.log(items[i]);
                grid.remove([items[i]], { removeElements: true });
                grid.layout();
                break;
            }
        }

        setTimeout(() => {
            $preventOpen = undefined;
        }, 1)
    }
</script>

<div id="sidebar">
    <Search></Search>
    <hr>
    <div id="buttons">
        {#each $tabs as tab, index (tab[1])}
            <div class="item"><Tab text={tab[0]} index={index}></Tab></div>
        {/each}
    </div>

    <p id="noteCount">{$tabs.length} {$tabs.length === 1 ? 'note' : 'notes'}</p>

    <div class="imgContainer" id="settings"
     role="button"
     tabindex="0"
     on:contextmenu|preventDefault
     on:mousedown|stopPropagation
     on:dragstart|preventDefault>
        <img src="settings.svg" alt="settings">
    </div>
    
    <div class="imgContainer" id="new"
     role="button"
     tabindex="0"
     on:click={newTab}
     on:contextmenu|preventDefault
     on:mousedown|stopPropagation
     on:dragstart|preventDefault>
        <img src="plus.svg" alt="new">
    </div>
</div>

<style>
    #sidebar {
        position: fixed;
        
        user-select: none;
        -webkit-user-select: none;

        left: 0;
        top: 0;

        width: var(--sidebar-width);
        height: calc(100%);
        
        overflow-y: auto;
    }

    #buttons {
        position: fixed;
        overflow: scroll;

        width: var(--sidebar-width);
        min-height: calc(100vh - 36px - 48px - 1vw - 18px);
        max-height: calc(100vh - 36px - 48px - 1vw - 18px);

        left: -3px;
        top: calc(48px + 1vw + 16px);
        padding: 2px;
        padding-bottom: 0;

        mask-image: linear-gradient(to bottom, white 95%, transparent 99%);
    }

    .item {
        position: absolute;
        cursor: grab;
        user-select: none;
        width: 100%;
        box-sizing: border-box;
        height: auto;
    }
    
    .muuri-item-content {
        padding: 0px;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    hr {
        animation: hr-appear 1s;
        border: solid 0.5px rgba(0, 0, 0, 0.05);
        width: 60%;
    }

    @keyframes hr-appear {
        0% {
            width: 0%;
            opacity: 0;
        }

        100% {
            width: 60%;
            opacity: 1;
        }
    }

    /* image button styling */
    .imgContainer {
        cursor: pointer;
        width: 14px;
        height: 14px;

        border-radius: 9px;
    }

    .imgContainer:hover {
        background: rgba(0, 0, 0, 0.04);
    }

    .imgContainer:active {
        background: rgba(0, 0, 0, 0.07);
    }
    
    .imgContainer:focus {
        background: rgba(0, 0, 0, 0.04);
        outline: none;
    }

    img {
        animation: rotate 0.8s ease-in-out;
        transition: 0.4s;
        -webkit-user-drag: none;

        opacity: 0.4;
        
        width: 14px;
        height: 14px;

        padding: 2px;
        
        margin-left: -2px;
        margin-top: -2px;
    }
    
    img:hover {
        transform: rotate(180deg);
        
        width: 15px;
        height: 15px;

        margin-left: -2.5px;
        margin-top: -2.5px;
    }

    @keyframes rotate {
        0% {
            transform: rotate(360deg);
            opacity: 0;
        }

        80% {
            opacity: 0.5;
        }

        100% {
            transform: rotate(0deg);
            opacity: 0.4;
        }
    }

    #settings {
        position: absolute;
        transition: 0.5s;

        left: 8px;
        bottom: 6px;
        padding: 6px;
    }

    #new {
        position: absolute;
        transition: 0.5s;

        right: 8px;
        bottom: 6px;
        padding: 6px;
    }

    #noteCount {
        animation: fade-in 0.8s;
        transition: 0.2s;
        
        position: absolute;
        cursor: pointer;

        color: var(--text-color);
        opacity: 0.4;
    
        text-align: center;
        font-size: 0.6em;
        font-weight: bold;

        width: 100%;

        left: 0;
        bottom: 4px;
    }

    #noteCount:hover {
        font-size: 0.64em;
        opacity: 0.5;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        80% {
            opacity: 0.65;
        }

        100% {
            opacity: 0.6;
        }
    }
</style>