chrome.runtime.onMessage.addListener((keyword: string, _, response: (json?: any) => void) => {
    fetch(`https://en.dict.naver.com/api3/enko/search?m=mobile&lang=ko&query=${keyword}`)
        .then(resp => resp.json())
        .then(json => response(json))

    return true
})