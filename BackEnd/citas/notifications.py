from abc import ABC, abstractmethod
from django.core.mail import EmailMessage
import pywhatkit as kit


class PasswordRecoveryNotifier(ABC):
    """Interface Segregation Principle: define solo el contrato necesario para recuperación de contraseña."""

    @abstractmethod
    def send_password_recovery(self, email, otp):
        raise NotImplementedError


class ReminderNotifier(ABC):
    """Interface Segregation Principle: define solo el contrato necesario para envío de recordatorios."""

    @abstractmethod
    def send_reminder(self, phone_number, message):
        raise NotImplementedError


class EmailPasswordRecoveryNotifier(PasswordRecoveryNotifier):
    def send_password_recovery(self, email, otp):
        subject = 'Recuperación de contraseña'
        message = f'Su código de recuperación es: {otp}'
        from_email = 'cristopherquintana2725@gmail.com'
        recipient_list = [email]

        email_message = EmailMessage(subject, message, from_email, recipient_list)
        email_message.send(fail_silently=False)


class WhatsAppReminderNotifier(ReminderNotifier):
    def send_reminder(self, phone_number, message):
        kit.sendwhatmsg_instantly(phone_number, message)
