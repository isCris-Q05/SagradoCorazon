import requests
import pyqrcode
from PIL import Image
from io import BytesIO

# URL para obtener el código QR
url = "https://waspable1.p.rapidapi.com/sessions/otp/show-qr"

# Headers con tu clave de API
headers = {
    "x-rapidapi-key": "804ceea84dmsh08cad729dcb3653p1083fejsnc57d70fadfe8",  # Reemplaza con tu clave de API
    "x-rapidapi-host": "waspable1.p.rapidapi.com"
}

# Hacer la solicitud GET para obtener el código QR
response = requests.get(url, headers=headers)

# Verificar la respuesta
if response.status_code == 200:
    print("Código QR obtenido correctamente.")
    qr_data = response.json()

    # Extraer el código QR (las partes están separadas por comas)
    qr_code_text = qr_data["code"]  # Este es el texto que representa el código QR

    # Generar un código QR a partir del texto usando pyqrcode
    qr = pyqrcode.create(qr_code_text)

    # Guardar el código QR en un archivo temporal
    qr.png("qr_code.png", scale=8)

    # Mostrar la imagen del código QR
    img = Image.open("qr_code.png")
    img.show()  # Esto abrirá la imagen del código QR en tu computadora

    print("Por favor, escanea el código QR con WhatsApp.")
else:
    print("Error al obtener el código QR:", response.status_code, response.text)