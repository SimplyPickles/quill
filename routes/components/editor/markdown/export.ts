export function exportFile(edit: HTMLElement) {
    return edit.innerText
        .replaceAll("• ", "- ")
        .replaceAll("□ ", "- [] ")
        .replaceAll("☑ ", "- [x] ")
        .replaceAll(" \\x", "");
}
