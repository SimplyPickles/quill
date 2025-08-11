export function exportFile(edit: HTMLElement) {
    return edit.innerText.replaceAll("\n", "br")
        .replaceAll("• ", "- ")
        .replaceAll("□ ", "- [] ")
        .replaceAll("☑ ", "- [x] ")
        .replaceAll(" \\x", "");
}
