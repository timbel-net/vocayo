"use strict";
document.addEventListener("mouseup", async () => {
    const { anchorNode, anchorOffset: start, focusNode, focusOffset: close } = document.getSelection();
    if (anchorNode === focusNode) {
        const keyword = anchorNode?.textContent?.substring(start, close);
        if (keyword) { // && e.shiftKey) {
            const response = await chrome.runtime.sendMessage({ type: 'dic', keyword });
            response?.searchResultMap?.searchResultListMap.WORD.items
                .forEach((item) => {
                item?.meansCollector[0].means
                    .forEach((mean) => console.log(mean));
            });
        }
    }
});
