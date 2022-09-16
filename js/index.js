const container1 = document.querySelector('.container1')

const writeText = () => {
    const h1 = container1.querySelector('h1')
    const h1Span = container1.querySelector('h1 span')
    const h2 = container1.querySelector('h2')
    const h1Text = 'Write your notes using the power of '
    const h1SpanText = 'Markdown'
    const h2Text = 'while enjoying your favorite music.'
    const delay = 60

    for (let i = 0; i < h1Text.length; i++) {
        setTimeout(() => {
            h1Span.insertAdjacentText('beforebegin', h1Text.charAt(i))
        }, i * delay)
    }

    setTimeout(() => {
        for (let i = 0; i < h1SpanText.length; i++) {
            setTimeout(() => {
                h1Span.insertAdjacentText('beforeend', h1SpanText.charAt(i))
            }, i * delay)
        }
    }, h1Text.length * delay)

    setTimeout(() => {
        h1.style.border = 'none'

        for (let i = 0; i < h2Text.length; i++) {
            setTimeout(() => {
                h2.insertAdjacentText('beforeend', h2Text.charAt(i))
            }, i * delay)
        }
    }, (h1Text.length * delay) + (h1SpanText.length * delay))
}

writeText()