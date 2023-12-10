interface ResponseItemMeanResult {
    value: string
}

interface ResponseItemMean {
    means: ResponseItemMeanResult[]
}

interface ResponseItem {
    meansCollector: ResponseItemMean[]
}

interface Response {
    searchResultMap?: {
        searchResultListMap: {
            WORD: {
                items: ResponseItem[]
            }
        }
    }
}
