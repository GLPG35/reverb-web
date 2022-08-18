const textarea = document.querySelector('.document .textarea')
const preview = document.querySelector('.preview')

const keyWords = [
    {
        rule: /<(http:\/\/|https:\/\/)(.*)>/gim,
        parse: '<a href="$1$2">$1$2</a>'
    },
    {
        rule: /<(.*)@(.*)>/gim,
        parse: '<a href="mailto:$1@$2">$1@$2</a>'
    },
    {
        rule: /^# (.*$)/gim,
        parse: '<h1>$1</h1>'
    },
    {
        rule: /^## (.*$)/gim,
        parse: '<h2>$1</h2>'
    },
    {
        rule: /^### (.*$)/gim,
        parse: '<h3>$1</h3>'
    },
    {
        rule: /^#### (.*$)/gim,
        parse: '<h4>$1</h4>'
    },
    {
        rule: /^##### (.*$)/gim,
        parse: '<h5>$1</h5>'
    },
    {
        rule: /^###### (.*$)/gim,
        parse: '<h6>$1</h6>'
    },
    {
        rule: /^(.+)\n\={3,}/gim,
        parse: '<h1>$1</h1>\n<hr>'
    },
    {
        rule: /^(.+)\n\-{3,}/gim,
        parse: '<h2>$1</h2>\n<hr>'
    },
    {
        rule: /^(?!.+)\n\={3,}/gim,
        parse: '\n<hr>'
    },
    {
        rule: /^(?!.+)\n\-{3,}/gim,
        parse: '\n<hr>'
    },
    {
        rule: /\*\*(.*)\*\*/gim,
        parse: '<b>$1</b>'
    },
    {
        rule: /__(.*)__/gim,
        parse: '<b>$1</b>'
    },
    {
        rule: /\*(.*)\*/gim,
        parse: '<em>$1</em>'
    },
    {
        rule: /\b(?![https:\/\/|http:\/\/])_(.*)_/gim,
        parse: '<em>$1</em>'
    },
    {
        rule: /^> (.*)/gim,
        parse: '<blockquote>$1</blockquote>'
    },
    {
        rule: /^ *\n\*/gim,
        parse: '<ul>\n*'
    },
    {
        rule: /^(\*.+) *\n([^\*])/gim,
        parse: '$1</ul>$2'
    },
    {
        rule: /^\* (.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /^ *\n-/gim,
        parse: '<ul>\n-'
    },
    {
        rule: /^(-.+) *\n([^-])/gim,
        parse: '$1</ul>$2'
    },
    {
        rule: /^- (.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /^ *\n\d+\. /gim,
        parse: '<ol>\n1.'
    },
    {
        rule: /^(\d\..+) *\n([^\d\.])/gim,
        parse: '$1</ol>$2'
    },
    {
        rule: /^\d\.(.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /\!\[([^\]]+)\]\(([^\)]+)\)/gim,
        parse: '<img src="$2" alt="$1" />'
    },
    {
        rule: /\[([^\]]+)\]\(([^\)]+)\)/gim,
        parse: '<a href="$2">$1</a>'
    },
    {
        rule: /\`(.*)\`/gim,
        parse: '<code>$1</code>'
    },
    {
        rule: /\n/gim,
        parse: '<br>'
    }
]

const keyWords2 = [
    {
        rule: /<\/h1><br>/gim,
        parse: '</h1>'
    },
    {
        rule: /<\/h2><br>/gim,
        parse: '</h2>'
    },
    {
        rule: /<\/h3><br>/gim,
        parse: '</h3>'
    },
    {
        rule: /<\/h4><br>/gim,
        parse: '</h4>'
    },
    {
        rule: /<\/h5><br>/gim,
        parse: '</h5>'
    },
    {
        rule: /<\/h6><br>/gim,
        parse: '</h6>'
    },
    {
        rule: /<hr><br>/gim,
        parse: '<hr>'
    },
    {
        rule: /<\/li><br><li>/gim,
        parse: '</li><li>'
    }
]

const saveDocument = (e) => {
    if (e.ctrlKey && e.keyCode == 83) {
        e.preventDefault()
    }
}

const markdownParser = (text) => {
    let parsedText = text

    keyWords.map(({rule, parse}) => {
        parsedText = parsedText.replace(rule, parse)
    })

    keyWords2.map(({rule, parse}) => {
        parsedText = parsedText.replace(rule, parse)
    })

    return parsedText.trim()
}

const previewText = (text) => {
    const parsedText = markdownParser(text)

    preview.innerHTML = parsedText
}

fetch('../js/resources/welcomeText').then(res => res.text())
.then(text => {
    textarea.value = text
    previewText(textarea.value)
})

document.addEventListener('keydown', saveDocument)
textarea.addEventListener('input', () => previewText(textarea.value))