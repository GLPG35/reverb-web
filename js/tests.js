const calcSueldo = () => {
    let error = 0

    do {
        const nombre = prompt('Ingrese su nombre:')

        if (nombre == null || nombre == '') {
            error = 1
        } else {
            const sueldo = Number(prompt('Ingrese su sueldo nominal:'))

            if (isNaN(sueldo)) {
                error = 1
            } else {
                const hijos = Number(prompt('Tiene hijos?\n\n1) Si\n2) No'))

                if (isNaN(hijos)) {
                    error = 1
                } else {
                    // Cálculo de descuentos
                    const discBPS = calcImpuesto(sueldo, 18)
                    const discIRPF = calcImpuesto(sueldo, 15)
                    let discFONASA

                    if (hijos == 1) {
                        discFONASA = calcImpuesto(sueldo, 6)
                    } else {
                        discFONASA = calcImpuesto(sueldo, 4)
                    }

                    const discFRL = calcImpuesto(sueldo, 1.25)

                    // Sueldo líquido
                    const liquido = sueldo - discBPS - discIRPF - discFONASA - discFRL

                    alert(`${nombre}, su sueldo líquido es de $${liquido}, gracias por permitirnos robarle su dinero`)
                    error = 0
                }
            }
        }

        if (error == 1) {
            alert('Ha ocurrido un error, realice la operación nuevamente')
        }
    } while (error == 1)
}

const calcImpuesto = (sueldo, descuento) => {
    const parseDescuento = descuento / 100
    
    return sueldo * parseDescuento
} 

document.querySelector('button').addEventListener('click', calcSueldo)