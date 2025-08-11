<script lang="ts">
    import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
    import { tabs, currentTab } from "../../../stores/store";

    import { setCaretOffset, getCaretOffset } from "./libs/caretHelpers";
    import { checkHeader } from "./markdown/headers";
    import { checkInlineTags } from "./markdown/inline";
    import { generateListFormat } from "./markdown/lists";
    import { generateChecklistFormat, checklistFixerUpper } from "./markdown/checklists";
    import { exportFile } from "./markdown/export";
    import { generateTitle } from "../scripts/randomTitle";

    let noteID: string = "";
    $: if ($tabs && $tabs.length > 0 && typeof $currentTab === "number" && $tabs[$currentTab]) {
        if ($currentTab === undefined || $currentTab === null) {
            $currentTab = 0;
        }

        if ($tabs[$currentTab][1] !== noteID) {
            updateNote();
        }
    }

    let edit: HTMLDivElement | undefined;
    async function updateNote() {
        if (edit) {
            const newID = $tabs[$currentTab][1];
            let newText: string[] = (await readTextFile(`${newID}.md`, {
                baseDir: BaseDirectory.AppLocalData
            })).split("\n");

            edit.innerHTML = "";
            for (let i = 0; i < newText.length; i++) {
                edit.innerHTML += `<div>${newText[i]}</div>`;
            }

            noteID = newID;
            handleInput(null);
        }
    }

    async function handleInput(event: InputEvent | null): Promise<void> {
        const edit = document.getElementById("edit");
        if (!edit) return;

        const selection: Selection | null = document.getSelection();
        if (selection) {
            if (!selection.isCollapsed || selection.anchorOffset !== selection.focusOffset) {
                return;
            }
        }

        if (event && event.inputType === "insertParagraph") {
            const sections: HTMLCollection = edit.children;
            const sectionsArray: Element[] = Array.from(sections);

            for (let i = 0; i < sectionsArray.length; i++) {
                const section: Element = sectionsArray[i];
                const sel: Selection | null = window.getSelection();
                
                if (sel && sel.anchorNode) {
                    let node: HTMLElement | null = sel.anchorNode as HTMLElement | null;
                    while (node && node.parentElement !== edit && node !== edit) {
                        node = node.parentElement as HTMLElement;
                    }

                    if (node === section) {
                        const text: string | null = node.textContent;
                        const caret: number = getCaretOffset(section);
                        
                        const chars: string[] = ["□", "☑", "•"];
                        for (let i: number = 0; i < chars.length; i++) {
                            if (node.previousSibling &&
                                node.previousSibling.textContent &&
                                node.previousSibling.textContent.startsWith(chars[i])) {
                                node.innerHTML = chars[i] + "&nbsp;" + text;
                                setCaretOffset(section, caret + 2);
                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }

        const sections: HTMLCollection = edit.children;
        const sectionsArray: Element[] = Array.from(sections);

        for (let i: number = 0; i < sectionsArray.length; i++) {
            let section: Element = sectionsArray[i];
            const text: string = section.textContent || "";

            let checked: Element | null = checkHeader(section, text);
            if (checked) {
                section = checked;
            }

            checkInlineTags(section);

            generateListFormat(section);
            generateChecklistFormat(section);
            checklistFixerUpper(section, text, getCaretOffset(section));

            const exported = exportFile(edit);

            $tabs[$currentTab][0] = exported.split("\n")[0].replace("#", "").trim();

            await writeTextFile(`${noteID}.md`, exported, {
                baseDir: BaseDirectory.AppData,
            });
        }

        const toolbar: HTMLDivElement = document.getElementById("toolbar") as HTMLDivElement;
        
        const matches = edit.innerText.match(/\b\w+\b/g);
        toolbar.innerHTML = `
            <widget>
            <img src="book.svg">
            words: ${matches ? matches.length : 0}
            </widget>
            <widget>
            <img src="character.svg">
                chars: ${edit.innerText.length}
            </widget>
            `;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="editor">
    <div
        id="edit"
        contenteditable="true"
        bind:this={edit}
        on:input={handleInput}
        on:load={handleInput(null)}
    >
        <div></div>
    </div>

    <div id="toolbar">
        <widget>
            <img src="book.svg">
            words: 0
        </widget>
        <widget>
            <img src="character.svg">
            characters: 0
        </widget>
    </div>
</div>

<style>
    #editor {
        animation: fade-in 0.4s;
        position: absolute;
        overflow: hidden;

        background: var(--background-color);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
        border: solid rgba(0, 0, 0, 0.03) .05em;

        width: calc(100% - var(--sidebar-width) - 6px);
        height: calc(100% - 12px);

        top: 6px;
        right: 6px;
        
        border-radius: 9px;
    }

    #edit {
        position: absolute;
        overflow: scroll;

        color: var(--text-color);

        width: calc(100% - 1%);
        height: calc(100% - 10px); 

        left: 1%;
        top: 4px;
        padding-top: 4px;

        line-height: 1.2em;
    }

    #edit:focus {
        outline: none;
    }

    #toolbar {
        cursor: default;
        transition: 0.6s;
        position: absolute;
        
        text-align: center;
        font-size: 0.6em;
        font-weight: 500;

        width: 100%;
        height: 16px;

        left: 0;
        bottom: 5px;

        transform: translateY(4px);
        opacity: 0;

        :global(widget) {
            transition: 0.3s;
            cursor: pointer;
            
            background: rgba(0, 0, 0, 0.06);
            color: var(--text-color);
            opacity: 0.6;

            user-select: none;
            -webkit-user-select: none;

            padding: 3px;
            padding-left: 6px;
            padding-right: 6px;

            margin: 2px;
            
            border: none;
            border-radius: 6px;

            :global(img) {
                margin-right: 2px;
                width: 10px;
                opacity: 0.6;
            }
        }

        :global(widget:hover) {
            background: rgba(0, 0, 0, 0.08);
        }

        :global(widget:active) {
            background: rgba(0, 0, 0, 0.08);
        }

    }

    #toolbar:hover {
        transform: translateY(0);
        opacity: 1;
    }

    :global(h1) {
        margin-top: 10px;
    }

    :global(h2) {
        margin-top: 4px;
        margin-bottom: 8px;
    }

    :global(h3) {
        margin-top: 4px;
        margin-bottom: 4px;
    }

    :global(h4) {
        margin-top: 4px;
        margin-bottom: 0;
    } 

    :global(h5) {
        margin-top: 4px;
        margin-bottom: 0px;
    }

    :global(h6) {
        margin-top: 4px;
        margin-bottom: -2px;
    }

    :global(.inline) {
        border-left: 2px solid var(--text-color);
        height: 1em;

        padding-left: 4px;
        padding-right: 8px;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
    }

    :global(mc) {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding-left: 4px;
        padding-right: 4px;

        @media (prefers-color-scheme: dark) {
            background: var(--tag-color);
        }
    }

    :global(u) {
        text-decoration-color: var(--text-color);
        text-decoration-thickness: 0.1em;
    }

    :global(st) {
        text-decoration: line-through;
        text-decoration-color: var(--text-color);
        text-decoration-thickness: 0.075em;
    }

    :global(s) {
        text-decoration: line-through;
        text-decoration-color: var(--text-color);
        text-decoration-thickness: 0.075em;
    }

    :global(tag) {
        color: var(--tag-color);
    }

    :global(calc) {
        color: var(--text-color);
        opacity: 0.5;
    }

    :global(temp) {
        color: var(--text-color);
        opacity: 0.5;
    }
    
    :global(#edit hr) {
        width: 50%;
        margin-right: 50%;
        
        border: solid 1px var(--text-color);
        opacity: 0.2;
        border-radius: 24px;
        
        caret-color: var(--text-color);
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
</style> 