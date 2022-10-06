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

const copyrightDate = () => {
    const copyright = document.querySelector('footer .copyright')
    const currentDate = new Date().getFullYear()
    
    copyright.innerHTML = `&copy; ${currentDate} Gian Luca Porto`
}

copyrightDate()

window.addEventListener('resize', responsive)
menuButton.addEventListener('click', (e) => {e.stopPropagation(), toggleMenu()})
body.addEventListener('click', closeMenu)