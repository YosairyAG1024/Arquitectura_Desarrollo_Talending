CREATE DATABASE tienda;
GO
USE tienda;
GO

CREATE TABLE productos(
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    creado_en DATETIME NOT NULL DEFAULT SysDateTime(),
);
