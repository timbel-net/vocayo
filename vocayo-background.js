"use strict";
chrome.runtime.onMessage.addListener((keyword, _, response) => {
    fetch(`https://en.dict.naver.com/api3/enko/search?m=mobile&lang=ko&query=${keyword}`)
        .then(resp => resp.json())
        .then(json => response(json));
    return true;
});
