const toggleSwitch2 = document.querySelector('.inputToggle')
const container1 = document.querySelector('.container1')
const downloadButton = container1.querySelector('.download')
const platformIcon = downloadButton.querySelector('i')
const platformSpan = downloadButton.querySelector('span')
const mainPreviewImg = container1.querySelector('.mainPreview img')
const bannerImg = document.querySelector('header .banner img')
const menuButton = document.querySelector('header .menu')
const menuList = document.querySelector('header ul')
const body = document.querySelector('body')

const responsive = () => {
    const menuOptions = [
        {
            name: 'home',
            icon: 'fas fa-home'
        },
        {
            name: 'about',
            icon: 'fas fa-info-circle'
        },
        {
            name: 'contact',
            icon: 'fas fa-phone'
        }
    ]

    if (window.innerWidth <= 700) {
        if (!menuList.querySelector('li a.home i')) {
            menuList.querySelector('li a.write')
                .innerHTML = `<i class="fas fa-pen-nib"></i>`

            menuOptions.forEach(({name, icon}) => {
                menuList.querySelector(`li a.${name}`)
                    .innerHTML = `<i class="${icon}"></i>`
            })
        }
    } else {
        if (menuList.querySelector('li a.home i')) {
            menuList.querySelectorAll('li a').forEach(element => {
                const classN = element.classList.value

                if (classN == 'write') {
                    menuList.querySelector('li a.write')
                        .innerHTML = '<i class="fas fa-pen-nib"></i> Write'

                    return
                }

                menuList.querySelector(`li a.${classN}`)
                    .innerHTML = classN.replace(/\b\w/g, c => c.toUpperCase())
            })
        }
    }

    if (window.innerWidth <= 350) {
        bannerImg.src != 'images/reverb_banner_icon.png' &&
            (bannerImg.src = 'images/reverb_banner_icon.png')
    } else {
        bannerImg.src != 'images/reverb_banner.png' &&
            (bannerImg.src = 'images/reverb_banner.png')
    }
}

responsive()

const toggleMenu = () => {
    menuList.classList.toggle('active')
}

const closeMenu = () => {
    menuList.classList.contains('active') && toggleMenu()
}

const writeText = () => {
    const h1 = container1.querySelector('h1')
    const h1Span = container1.querySelector('h1 span')
    const h2 = container1.querySelector('h2')
    const h1Text = 'Write your notes using the power of '
    const h1SpanText = 'Markdown'
    const h1Cursor = container1.querySelector('h1 .cursor')
    const h2Text = 'while enjoying your favorite music.'
    const h2Cursor = container1.querySelector('h2 .cursor')
    const delay = 60

    Array.from(h1Text).forEach((char, i) => {
        setTimeout(() => {
            h1Span.insertAdjacentText('beforebegin', char)
        }, i * delay)
    })

    setTimeout(() => {
        Array.from(h1SpanText).forEach((char, i) => {
            setTimeout(() => {
                h1Span.insertAdjacentText('beforeend', char)
            }, i * delay)
        })
    }, h1Text.length * delay)

    setTimeout(() => {
        h1Cursor.style.display = 'none'
        h2Cursor.classList.add('active')

        Array.from(h2Text).forEach((char, i) => {
            setTimeout(() => {
                h2Cursor.insertAdjacentText('beforebegin', char)
            }, i * delay)
        })
    }, (h1Text.length * delay) + (h1SpanText.length * delay))
}

writeText()

const checkTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'light'

    mainPreviewImg.src = `images/main_${currentTheme}.webp`
}

checkTheme()

const checkPlatform = () => {
    const platform = navigator.userAgentData.platform
    const platformList = [
        {
            name: 'Windows',
            icon: 'fab fa-windows'
        },
        {
            name: 'Macintosh',
            icon: 'fab fa-apple'
        },
        {
            name: 'Linux',
            icon: 'fab fa-linux'
        }
    ]

    return platformList.find(x => x.name == platform) ?? 'Other'
}


if (checkPlatform() != 'Other') {
    platformIcon.className = checkPlatform().icon
    platformSpan.innerText = checkPlatform().name
} else {
    platformIcon.className = 'fas fa-circle-question'
    platformSpan.innerText = 'Other OS'
}

const downloadReverb = () => {
    // Function will be available if the desktop version is ready.
    const checkOS = checkPlatform()
}

toggleSwitch2.addEventListener('change', checkTheme)
downloadButton.addEventListener('click', downloadReverb)
window.addEventListener('resize', responsive)
menuButton.addEventListener('click', (e) => {e.stopPropagation(), toggleMenu()})
body.addEventListener('click', closeMenu)