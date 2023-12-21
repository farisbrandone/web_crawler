const { JSDOM } = require('jsdom')
const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
function normalizeURL(url) {
    try {
        const tabUrl = new URL(url)
        const refName = tabUrl.hostname.concat(tabUrl.pathname)
        if (refName[refName.length - 1] === '/') {
            return refName.slice(0, refName.length - 1)
        }
        return refName
    } catch (error) {
        console.log('the input URL is not good')
    }

}

function relaToAbs(path, baseURL) {
    if (path.charAt(0) !== "/") {
        return ""
    }
    const url = new URL(baseURL)
    const theUrl = `https://${normalizeURL(`${baseURL}${path}`)}`
    return theUrl
}

function getURLsFromHTML(htmlBodys, baseURL) {
    const htmlBody = htmlBodys
    const dom = new JSDOM(htmlBody)
    const tab = dom.window.document.querySelectorAll('a')
    console.log(tab.length)
    const result = []
    for (let elt of tab) {
        let fil = elt.href
        if (fil.slice(0, 8) !== "https://") {
            console.log(fil)
            try {
                fil = relaToAbs(fil, baseURL)
                console.log(fil)
                if (fil === "") continue
            } catch (error) {
                console.log(error.message)
            }

        }
        try {
            const myUrl = new URL(fil)
            if (myUrl.pathname === '/') {
                result.push(myUrl.href)
            }
            else {
                result.push(fil)
            }

        } catch (error) {
            console.log("url non conforme")
        }

    }

    return result
}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = { [baseUrl]: 0 }) {

    /* if (!baseUrl) {

       readline.question(`enter the url?`, async (...args) => {
           if (args.length < 1) {
               console.log('Invalid input, the number of parameter is not equal 1')
           }
           else if (args.length > 1) {
               console.log('Invalid input, the number of parameter is not equal to 1')
           }
           else {
               console.log('the Crawler is starting ......')
               baseUrl=args[0]
               currentUrl=args[0]

           }
           
       });
   }  */

    //try {
    //console.log(currentUrl)
    const response = await fetch(currentUrl)
    const myHtml = await response.text()
    //console.log('ok2')
    const a = response.headers.get('content-type')
    if (response.status > 400) {
        console.log("blabla")
        console.log('error')
        return pages
    }
    if (!a.includes('text/html')) {
        console.log("popo")
        console.log('error')
        return pages
    }
    else {

        const result = getURLsFromHTML(myHtml, currentUrl)
        console.log(result)
        for (let elt of result) {
            if (Object.keys(pages).includes(elt)) {
                //console.log('oui, oui')
                //console.log(Object.keys(pages))
                pages[elt]++
            }
            else {
                pages[elt] = 1
                pages = await crawlPage(baseUrl, ` https://${normalizeURL(elt)}`, pages)
            }
        }
        console.log("meme")
        console.log(pages)
        return pages

    }
    /*  } catch (error) {
         console.log(`can not connect with the server.
 Please see your connection`)
         return
     } */
}

/* async function main() {
    
        const result=await crawlPage('https://wagslane.dev')
        console.log(result)
}

main() */





module.exports = {
    crawlPage,
    normalizeURL,
    relaToAbs,
    getURLsFromHTML
}
