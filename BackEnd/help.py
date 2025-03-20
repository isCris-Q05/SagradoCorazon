import sqlite3  

# Conectar a la base de datos
conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Obtener el listado de todas las tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tablas = cursor.fetchall()

print(f"Tablas: {tablas}")

# Tablas que no se deben eliminar
tablas_excluidas = {
    "citas_enfermedad",
    "citas_tratamiento",
    "citas_producto",
    "citas_especialidad",
    "citas_alergia"
}

# Eliminar registros de todas las tablas excepto las excluidas
for tabla in tablas:
    tabla_nombre = tabla[0]
    if tabla_nombre not in tablas_excluidas:
        cursor.execute(f"DELETE FROM {tabla_nombre};")

# Confirmar los cambios
conn.commit()

# Cerrar la conexión
conn.close()