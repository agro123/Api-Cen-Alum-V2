 CREATE TABLE Usuario (
     id_Usuario SERIAL PRIMARY KEY,
     usuario VARCHAR(255) NOT NULL,
     nombre VARCHAR(255) NOT NULL,
     contrasena VARCHAR(255) NOT NULL,
 );

CREATE TABLE Cliente (
     id_Cliente SERIAL  PRIMARY KEY,
     nombre VARCHAR(255) NOT NULL,
     identificacion CHAR(10),
     direccion VARCHAR(255),
     telefono VARCHAR(32),
     email VARCHAR(255),
 );

CREATE TABLE Cotizacion (
    id_Cotizacion SERIAL  PRIMARY KEY,
    id_Cliente int NOT NULL,
    fecha DATE NOT NULL,
    observaciones VARCHAR(255),
    total INT NOT NULL,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente)
);

CREATE TABLE Producto (
    id_Producto SERIAL  PRIMARY KEY,
    referencia INT NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    precio_unidad INT NOT NULL,
);

CREATE TABLE Productos_Agregados (
    id_Producto INT NOT NULL,
    id_Cotizacion INT NOT NULL,
    ancho FLOAT,
    alto FLOAT,
    area FLOAT,
    precioTotal INT NOT NUTLL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_Cotizacion) REFERENCES Cotizacion(id_Cotizacion),
    FOREIGN KEY (id_Producto) REFERENCES Producto(id_Producto)
);

CREATE TABLE Cuenta_de_cobro (
    id_Cuenta_de_cobro SERIAL PRIMARY KEY,
    id_Cotizacion INT NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_Cotizacion) REFERENCES Cotizacion(id_Cotizacion)
);