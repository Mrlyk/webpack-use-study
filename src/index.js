function createEL(){
    let element = document.createElement('div')
    element.innerHTML = 'Hello Web'
    return element
}

document.body.appendChild(createEL())
