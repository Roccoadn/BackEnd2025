fetch('http://localhost:8080/api/products')
.then(data => {return data.json()})
    .then(res =>{
        const container = document.querySelector('#products-container')
        res.forEach(product => {
        const div = document.createElement('div')
        div.innerHTML = `
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <h2>${product.price}</h2>
        `
        container.appendChild(div)
    })
})