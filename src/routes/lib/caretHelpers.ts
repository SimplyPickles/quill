export function getCaretOffset(el: Element): number {
    const sel: Selection | null = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;

    if (sel.focusNode) {
        const range = sel.getRangeAt(0).cloneRange();
        range.selectNodeContents(el);
        range.setEnd(sel.focusNode, sel.focusOffset);

        return range.toString().length;
    }

    return 0;
}

export function setCaretOffset(el: Element, offset: number): void {
    let node = null, off = 0;

    (function find(n) {
        if (node) return;
        if (n.nodeType === 3) {
            const len = n.length;
            if (off + len >= offset) node = n;
            else off += len;
        } else for (let c of n.childNodes) find(c);
    })(el);

    if (node) {
        const sel = window.getSelection(), r = document.createRange();
        
        r.setStart(node, offset - off);
        r.collapse(true);

        if (sel) {
            sel.removeAllRanges();
            sel.addRange(r);
        }
    }
}