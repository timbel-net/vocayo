---
title: Vocayo (Browser extension)
theme: eloc

transition: fade-out
mdc: true
page: 1
---

# Vocayo

Browser Extension
<div class="text-xl">for Chrome</div>


<div class="text-sm mt-20"><code>vocabulary</code> 에서 유래한 말로, 어휘사전 이에요.</div>


---
transition: slide-left
---

# goal

- **공식 문서 읽기** - 새로운 개발 플랫폼에 접근법
- **타 서비스 API** - HTTP 를 활용하는 다양한 방법
- **Serverless** - Cloud Platform 활용

---
transition: slide-left
---
# production

https://github.com/timbel-net/vocayo

<img v-click src="https://raw.githubusercontent.com/timbel-net/vocayo/feat-gwang-yang/docs/vocayo-chrome-extension/sample.gif" />


---
transition: slide-up
---
# [manifest.json](https://developer.chrome.com/docs/extensions/reference/manifest?hl=ko)

---
transition: slide-up
---
# service_worker
```json {5}
{
  ...,

  "background": {
    "service_worker": "vocayo-background.js"
  }
}
```
<a class="text-sm text-right w-[640px]" href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics?hl=ko" target="_blank">공식문서</a>

- `service_worker` 웹어플리케이션과 별개로 독립적으로 실행되는 서비스<br>(네이버 사전으로 API 요청을 보내게 될 거에요.)


---
transition: slide-up
---
# content_scripts
```json {5-7}
{
  ...,

  "content_scripts": [{
    "matches": [ "<all_urls>" ],
    "js": [ "vocayo-content.js" ],
    "css": [ "vocayo-content.css" ]
  }]
}
```
<a class="text-sm text-right w-[640px]" href="https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts?hl=ko" target="_blank">공식문서</a>

- `matches` 에 부합되는 URL의 사이트 매칭
- `js` 매칭된 사이트에서 실행될 javascript
- `css` 매칭된 사이트에서 실행될 css files


---
transition: slide-left
---
# host_permissions
```json{5-6}
{
  ...,

  "host_permissions": [
    "https://dict.naver.com/",
    "https://en.dict.naver.com/"
  ]
}
```
<a class="text-sm text-right w-[640px]" href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions?hl=ko#host-permissions" target="_blank">공식문서</a>

네이버 사전에 API 요청을 보내게 되는 부분에서 [CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS) 등의 문제를 벗어나는데 필요  

---
transition: slide-left
---
# implementation
- Typescript
  - 손쉬운 API 명세 확인
  - Intellisense 기능으로 힌트 확인
  - 미지의 API에 접근을 용이하게 하는 방법
- [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)
  - 브라우저 확장프로그램 개발 지원

---
transition: slide-up
---
# vocayo-background.ts
```ts{0|3-5|7}
// vocayo-background.ts
chrome.runtime.onMessage.addListener((keyword: string, _, response: (json?: any) => void) => {
    fetch(`https://en.dict.naver.com/api3/enko/search?m=mobile&lang=ko&query=${keyword}`)
        .then(resp => resp.json())
        .then(json => response(json))

    return true
})
```
<a class="text-sm text-right w-[1100px]" href="https://developer.chrome.com/docs/extensions/reference/api/runtime?hl=ko#event-onMessage" target="_blank">공식문서</a>

네이버 사전 API에 요청을 보내고 응답을 받아요.
<div v-click>⚠️ 비동기 응답을 위해선 이벤트 함수가 <code>return true</code> 를 반환
<a href="https://developer.chrome.com/docs/extensions/develop/concepts/messaging?hl=ko" target="_blank">[참조]</a>
</div>


---
transition: slide-up
---
# vocayo-content.ts
```ts{0|2|8|9-10}
// vocayo-content.ts
const {anchorNode, anchorOffset: start, focusNode, focusOffset: close} = document.getSelection()!

if (anchorNode === focusNode) {
    const keyword = anchorNode?.textContent?.substring(start, close)?.trim()

    if (isWord(keyword)) {
        const response: Response = await chrome.runtime.sendMessage(keyword)
        const contents = response?.searchResultMap?.searchResultListMap.WORD.items
            .map(item => item.meansCollector[0].means[0].value).join('<hr/>')

        if (contents) {
            openPopup(contents, e.clientX, e.clientY)
        }
    }
}
```
<a class="text-sm text-right w-[1100px]" href="https://developer.chrome.com/docs/extensions/reference/api/runtime?hl=ko#method-sendMessage" target="_blank">공식문서</a>


- <div v-click="1">사이트에서 마우스로 선택된 텍스트를 읽어 들임<a><sup href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank">구조분해할당</sup></a></div>
- <div v-click="2">vocayo-background.js에 <code>onMessage</code>로 키워드 전달</div>
- <div v-click="3">응답 받은 내용 구성 (타입정의 NaverDictionary.d.ts)</div> 


---
transition: slide-left
---
# vocayo-content.ts
```ts{0|9-17}
// vocayo-content.ts
const openPopup = (() => {
    const popup = document.createElement('div')
    popup.id = 'vocayo-popup'

    document.body.append(popup)

    return (content: string, x: number, y: number) => {
        popup.innerHTML = content
        popup.style.left = `${x}px`
        popup.style.top = `${y}px`
        popup.classList.add('open')

        document.body.addEventListener('mousedown', function closePopup() {
            document.body.removeEventListener('mousedown', closePopup)
            popup.classList.remove('open')
        })
    }
})()
```
<a class="text-sm text-right w-[900px]" href="https://developer.chrome.com/docs/extensions/reference/api/runtime?hl=ko#method-sendMessage" target="_blank">공식문서</a>

- <div>사이트에서 결과 보여주기</div>
- <div v-click="1"><a href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures" target="_blank">클로저</a> 패턴으로 구현</div>


---
transition: fade
---
# conclusion
- earning
  - 새로운 개발 플랫폼에 대한 접근법
- be desired
  - 목표했던 Serverless 를 활용하지 못함
  - 어쩌면 필요없는 플랫폼 지식 축적으로... 🤯 


---
---
# End.