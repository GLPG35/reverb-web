const sidebarOptions = document.querySelectorAll('.sidebar .section')

const changeView = (id) => {
    const targetOption = document.querySelector(`.view.${id}`)
    const currentOption = document.querySelector('.view.active')
    
    if (targetOption == currentOption) return

    currentOption.classList.remove('active')
    targetOption.classList.add('active')
}

sidebarOptions.forEach(element => element.addEventListener('click', () => changeView(element.id)))