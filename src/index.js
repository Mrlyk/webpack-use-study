function createEL(){
    let element = document.createElement('div')
    element.innerHTML = 'Hello Webpack4'
    return element
}

document.body.appendChild(createEL())


