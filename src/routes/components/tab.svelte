<script lang="ts">
    import { tabs, currentTab, preventOpen } from "../../stores/store";

    export let text: string = "untitled";
    export let current: boolean = false;
    export let index: number = 0;

    function setTab() {
        if ($preventOpen) return;
        $currentTab = index;
        document.getElementById("container")?.scrollIntoView();
    }

    let container: HTMLDivElement;

    function closeTab() {
        if (!container) return;
        $preventOpen = container;

        if (index < $currentTab) {
            $currentTab--;
        }
    }
</script>

<div bind:this={container}
     id="container"
     style={`animation-delay: ${index * 0.05}s`}
     class="item"
     class:currentTab={$currentTab==index}
     on:contextmenu|preventDefault
     on:mousedown|stopPropagation
     on:click={setTab}
>
    <button id="button" class:currentTab={current}>
        <p>{text}</p>
    </button>
    <div class="imgContainer" on:click={closeTab}>
        <img src="minus.svg" />
    </div>
</div>

<style>
    #container {
        animation: slide-down 0.6s ease forwards;
        animation-fill-mode: backwards;

        position: relative;
        user-select: none;

        width: calc(100% - 16px);
        height: calc(24px + .5vw);

        margin-left: 8px;
        margin-bottom: 6px;

        border-radius: 9px;
    }

    /* new image button styling */
    .imgContainer {
        cursor: pointer;
        
        opacity: 0;
        border-radius: 9px;
        
        transition: 0.2s;
        position: absolute;
        
        width: 14px;
        height: 14px;
        
        right: 2px;
        bottom: 2px;
        padding: 6px;
        opacity: 0.4;
    }
    
    img {        
        -webkit-user-drag: none;
        position: absolute;
        top: 50%;
        opacity: 0;
    }

    .imgContainer:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.04);
        img {
            opacity: 0.5;
        }
    }

    .imgContainer:active {
        background: rgba(0, 0, 0, 0.06);
    }

    /* button styling */
    button {
        position: absolute;

        cursor: pointer;
        transition: 0.2s;
        
        text-align: left;
        font-size: 0.8em;
        
        background: rgba(0, 0, 0, 0);
        
        border: solid rgba(0, 0, 0, 0) .05em;
        border-radius: 9px;

        width: 100%;
        height: 100%;

        top: 0;
        right: 0;

        p {
            transition: 0.2s;
            position: absolute;
            
            color: var(--text-color);
            opacity: 0.5;

            width: 72%;
            height: 100%;
            
            top: -6px;
            left: 8px;

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    button:hover,
    button:focus {
        background: rgba(0, 0, 0, 0.04);
        outline: none;
    }

    button:active {
        background: rgba(0, 0, 0, 0.06);
    }

    .currentTab {
        p {
            opacity: 1;
        }
        
        background: var(--background-color);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
        border: solid rgba(0, 0, 0, 0.03) .05em;
    }

    .currentTab:hover,
    .currentTab:focus {
        background: var(--background-color);
    }

    @keyframes slide-down {
        0% {
            transform: translateY(-10%);
            opacity: 0;
        }

        80% {
            transform: translateY(0%);
        }

        100% {
            opacity: 1;
        }
    }
</style>