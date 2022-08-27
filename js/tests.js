const calcSueldo = () => {
    const nombre = prompt('Ingrese su nombre:')
    const sueldo = Number(prompt('Ingrese su sueldo nominal:'))
    const hijos = Number(prompt('Tiene hijos?\n\n1) Si\n2) No'))

    // Cálculo de descuentos
    const discBPS = calcImpuesto(sueldo, 18)
    const discIRPF = calcImpuesto(sueldo, 15)
    const discFONASA = hijos == 1 ? calcImpuesto(sueldo, 6) : calcImpuesto(sueldo, 4)
    const discFRL = calcImpuesto(sueldo, 1.25)

    // Sueldo líquido
    const liquido = sueldo - discBPS - discIRPF - discFONASA - discFRL

    alert(`${nombre}, su sueldo líquido es de $${liquido}, gracias por permitirnos robarle su dinero`)
}

const calcImpuesto = (sueldo, descuento) => {
    const parseDescuento = descuento / 100
    
    return sueldo * parseDescuento
} 

document.querySelector('button').addEventListener('click', calcSueldo)