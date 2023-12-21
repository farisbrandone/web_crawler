async function main() {
  const response = await fetch('https://www.google.com')
  const textHtml = await response.text()
  console.log(textHtml)
  const myUrl = new URL('https://github.com/wagslane/')
  console.log(myUrl.origin)
}

main()
