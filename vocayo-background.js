"use strict";
chrome.runtime.onMessage.addListener(({ keyword }, _, sendResponse) => {
    fetch(`https://en.dict.naver.com/api3/enko/search?m=mobile&lang=ko&query=${keyword}`)
        .then(resp => resp.json())
        .then(json => sendResponse(json));
    return true;
});
