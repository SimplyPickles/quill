import { setCaretOffset, getCaretOffset } from "../libs/caretHelpers";

export function checkHeader(section: Element, text: string) {
    const headerMatch = text.match(/^(#{1,6})\s(.*)/);
    if (headerMatch) {
        const level = headerMatch[1].length;
        if (section.tagName !== `H${level}`) {
            const caret = getCaretOffset(section);

            const heading = document.createElement(`h${level}`);
            heading.innerHTML = headerMatch[0];
            heading.className = section.className;

            section.parentNode?.replaceChild(heading, section);
            
            setCaretOffset(heading, caret);
            return heading;
        }
    } else if (section.tagName.includes("H") && !section.textContent.startsWith(`${"#".repeat(parseInt(section.tagName.substring(1)))} `)) {
        const caret = getCaretOffset(section);
        const div = document.createElement(`div`);
        
        div.innerHTML = section.innerHTML;
        div.className = section.className;

        section.parentNode?.replaceChild(div, section);

        setCaretOffset(div, caret);
        return div;
    }

    return null;
}
