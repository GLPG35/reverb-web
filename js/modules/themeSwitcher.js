const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
const toggleSwitch = document.querySelector('.inputToggle')
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null

const isChecked = () => {
    if (toggleSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    }
}

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)

    if (currentTheme == 'dark') {
        toggleSwitch.checked = true
    }
} else {
    if (colorScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark')
        toggleSwitch.checked = true
    }
}

toggleSwitch.addEventListener('change', isChecked)