import smtplib

sender = "Private Person <cristopherquintana2725@gmail.com>"
receiver = "A Test User <jodemit777@hikuhu.com>"

message = f"""\
Subject: Prueba de correo
To: {receiver}
From: {sender}

Este es un mensaje de prueba enviado desde Python."""

try:
    with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
        server.starttls()
        server.login("39cfaa1457c438", "3b1c8ce13f003e")
        server.sendmail(sender, receiver, message)
        print("Correo enviado correctamente.")
except Exception as e:
    print(f"Error al enviar el correo: {e}")