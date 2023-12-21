function printReport(pages){
    console.log("report is satrting ...")
    const myTab=Object.keys(pages).map(elt=>({elt:pages[elt]}))
    myTab.sort((a,b)=>Object.values(a)[0]-Object.values(b)[0])
    for (const e of myTab){
        console.log(`Found ${Object.values(e)[0]} internal links to ${Object.keys(e)[0]}`)
    }
}


