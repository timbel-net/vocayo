"use strict";
const isWord = (keyword = '') => /^[a-z]{2,}$/i.test(keyword);
const openPopup = (() => {
    const popup = document.createElement('div');
    popup.id = 'vocayo-popup';
    document.body.append(popup);
    return (content, x, y) => {
        popup.innerHTML = content;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.classList.add('open');
        document.body.addEventListener('mousedown', function closePopup() {
            document.body.removeEventListener('mousedown', closePopup);
            popup.classList.remove('open');
        });
    };
})();
document.addEventListener("mouseup", async (e) => {
    const { anchorNode, anchorOffset: start, focusNode, focusOffset: close } = document.getSelection();
    if (anchorNode === focusNode) {
        const keyword = anchorNode?.textContent?.substring(start, close)?.trim();
        if (isWord(keyword)) {
            const response = await chrome.runtime.sendMessage(keyword);
            const contents = response?.searchResultMap?.searchResultListMap.WORD.items
                .map(item => item.meansCollector[0].means[0].value).join('<hr/>');
            if (contents) {
                openPopup(contents, e.clientX, e.clientY);
            }
        }
    }
});
