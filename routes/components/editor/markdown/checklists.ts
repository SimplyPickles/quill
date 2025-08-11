import { setCaretOffset } from "../libs/caretHelpers";

export function generateChecklistFormat(section: Element) {
    const text: string = (section as HTMLDivElement).innerText;
    if (text.startsWith("[] ")) {
        section.innerHTML = `□ ${text.substring(2)}`;
        setCaretOffset(section, section.innerHTML.length);
    }

    if (text.startsWith("□ ")) {
        if (text.endsWith("\\x")) {
            section.innerHTML = `☑ <s>${text.substring(2, text.length - 2).trimEnd()}</s>&nbsp;<temp>\\x</temp>`;

            const selection: Selection | null = document.getSelection();
            const range: Range = document.createRange();

            if (!selection) return;
            range.setStart(section, 4);
            range.setEnd(section, 4);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

export function checklistFixerUpper(section: Element, text: string, caret: number): void {
    if (text.startsWith("☑")) {
        if (!text.endsWith("\\x")) {
            section.innerHTML = `□ ${text.substring(2)}`;
            setCaretOffset(section, section.innerHTML.length);
        }
    } else if (section.innerHTML.includes("□") && !section.innerHTML.includes("<temp>\\x</temp>")) {
        if (section.innerHTML.includes("<temp>")) {
            section.innerHTML = section.innerHTML
                                .replaceAll("<temp>", "")
                                .replaceAll("</temp>", "");

            setCaretOffset(section, caret);
        }
    }

    if (section.innerHTML.includes("<temp>\\x</temp>")) {
        if (!text.startsWith("☑") && !text.startsWith("□")) {
            section.innerHTML = section.innerHTML
                                .replaceAll("<temp>", "")
                                .replaceAll("</temp>", "")
                                .replaceAll("<s>", "")
                                .replaceAll("</s>", "");

            setCaretOffset(section, caret);
        }
    }
}