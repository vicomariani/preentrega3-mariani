//Clase molde para los productos de la aplicacion
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

class BaseDeDatos {
    constructor() {
        //Array para el catalogo
        this.productos = [];
        //Cargamos productos
        this.agregarRegistro(1, "MONSTERA", 5400, "Interio", "monstera.jpg");
        this.agregarRegistro(2, "PALMERA", 6500, "Interior", "palmera.jpg");
        this.agregarRegistro(3, "PIMIENTO", 4600, "Interior", "pimiento.jpg");
        this.agregarRegistro(4, "NIDO", 3600, "Interior", "nido.jpg");
        this.agregarRegistro(5, "HIGUERA", 4800, "Interior", "higuera.jpg");
        this.agregarRegistro(6, "LIRIO", 5300, "Interior", "lirio.jpg");
    }

    // Metodo que crea el objeto producto y lo almacena en el catalogo
    agregarRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
 
    }
    //Nos devuelve el catalogo de productos
    traerRegistros() {
        return this.productos;
    }
    //Nos devuelve un producto segun el id
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }
    //Nos devuelve un array con todas las coincidencias que encuentre segun el nombre del producto
    registrosPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    }
}

class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));

        this.carrito = carritoStorage || [];
        this.total = 0;
        this.cantidadProductos = 0;
        this.listar();
    }

    estaEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }

    agregar(producto) {
        const productoEnCarrito = this.estaEnCarrito(producto);

        if (!productoEnCarrito) {
            this.carrito.push({ ...producto, cantidad: 1 });            
        } else {
            productoEnCarrito.cantidad++;
        }

        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();
    }

    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
          this.carrito.splice(indice, 1);
        }
        //Actualizo el storage
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();       
    }

    listar() {
        this.total = 0;
        this.cantidadProductos = 0;
        divCarrito.innerHTML = "";
        
        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
              <div class="productoCarrito">
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
              </div>
            `;

            this.total += producto.precio * producto.cantidad;
            this.cantidadProductos += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.addEventListener("click", (event) => {
                event.preventDefault();
                const idProducto = Number(boton.dataset.id);
                this.quitar(idProducto);
            });
        }

        spanCantidadProductos.innerText = this.cantidadProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

//Instanciamos la base de datos
const bd = new BaseDeDatos();

//Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");

//Instanciamos la clase carrito
const carrito = new Carrito();

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    
    divProductos.innerHTML = "";

    for (const producto of productos) {
        divProductos.innerHTML += `
            <div class="producto">
              <h2>${producto.nombre}</h2>
              <div class="imagen">           
                <img src="img/${producto.imagen}" /> 
              </div>
              <p class="precio">$${producto.precio}</p>
              <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        `;
    }
//Lista dinamica con todos los botones que hay en el catalogo
    const botonesAgregar = document.querySelectorAll(".btnAgregar");

    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const idProducto = Number(boton.dataset.id);
            const producto = bd.registroPorId(idProducto);
            
            carrito.agregar(producto);
        });
    }
}

//Buscador
inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
});



