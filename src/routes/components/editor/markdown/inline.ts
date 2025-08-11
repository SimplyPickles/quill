import { setCaretOffset, getCaretOffset, endLine } from "../libs/caretHelpers";

export function checkInlineTags(section: Element) {
    const caret: number = getCaretOffset(section);
    let caretOffset: number = 0;

    let html: string = section.innerHTML;

    if (html.startsWith("- ")) {
        setTimeout((): void => {
            endLine(section);
        }, 1);
    }

    html = html
        .replace(/<\/?tag>/g, "")
        .replace(/<\/?b>/g, "")
        .replace(/<\/?i>/g, "")
        .replace(/<\/?u>/g, "")
        .replace(/<\/?st>/g, "")
        .replace(/<\/?mc>/g, "");

    html = html
        .replace(/^(#{1,6})/g, "<tag>$1</tag>")
        .replace(/^&gt; (.+)/gm, "<bq>$1</bq>")
        .replace(/`(.*?)`/g, "<tag>`</tag><mc>$1</mc><tag>`</tag>")
        .replace(/\*\*(.*?)\*\*/g, "<tag>**</tag><b>$1</b><tag>**</tag>")
        .replace(/\*(.*?)\*/g, "<tag>*</tag><i>$1</i><tag>*</tag>")
        .replace(/__(.*?)__/g, "<tag>__</tag><u>$1</u><tag>__</tag>")
        .replace(/~~(.*?)~~/g, "<tag>~~</tag><st>$1</st><tag>~~</tag>")
        .replace(/<st><st>/g, "<st>")
        .replace(/<\/st><\/st>/g, "</st>");
        
    if (section.innerHTML !== html) {
        section.innerHTML = html;
        setCaretOffset(section, caret + caretOffset);
    }
}