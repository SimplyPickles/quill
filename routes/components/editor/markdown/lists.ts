import { setCaretOffset } from "../libs/caretHelpers";

export function generateListFormat(section: Element) {
    const text: string = (section as HTMLDivElement).innerText;
    if (text.startsWith("- ")) {
        section.innerHTML = `• ${text.substring(2)}`;
        setCaretOffset(section, section.innerHTML.length);
    }
}