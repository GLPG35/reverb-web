const body = document.querySelector('body')
const h1 = document.querySelector('.container1 h1')
const button = document.querySelector('.container1 .change')
const button2 = document.querySelector('.container1 .count')

let counter = 0

const changeFont = () => {
    let error = false

    do {
        let opt = Number(prompt(`
            Ingrese la fuente que quiere seleccionar:

            1) Open Sans
            2) Roboto Mono
            3) Source Code Pro
            4) Silkscreen`
        ))

        if (error) error = false

        switch (opt) {
            case 0:
                return

            case 1:
                body.style.fontFamily = 'Open Sans'
                h1.style.fontWeight = '900'
                break

            case 2:
                body.style.fontFamily = 'Roboto Mono'
                h1.style.fontWeight = '700'
                break

            case 3:
                body.style.fontFamily = 'Source Code Pro'
                h1.style.fontWeight = '900'
                break

            case 4:
                body.style.fontFamily = 'Silkscreen'
                h1.style.fontWeight = '400'
                break

            default:
                alert('Incorrecto, ingrese una opción válida')
                error = true
                break
        }

        if (opt == 1 || opt == 2 || opt == 3 || opt == 4) counter++
    } while (error)
}

const timesPressed = (num) => {
    let drawing = ''

    for (let i = 0; i < num; i++) {
        drawing = drawing + ' *'
    }

    alert(`
        ${drawing}
        Cambiaste la fuente ${num} ${num == 1 ? 'vez' : 'veces'}
    `)
}

button.addEventListener('click', changeFont)
button2.addEventListener('click', () => timesPressed(counter))
