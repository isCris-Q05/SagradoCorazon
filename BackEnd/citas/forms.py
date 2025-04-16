from django import forms
from .models import Usuario, Paciente, Medico
from django.contrib.auth.models import User

class FormularioBusqueda(forms.Form):
    busqueda = forms.CharField(label='Busqueda', max_length=100)

class CustomUserForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=True, label="Nombre")
    last_name = forms.CharField(max_length=30, required=True, label="Apellido")
    password1 = forms.CharField(widget=forms.PasswordInput, label="Contraseña")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirmar contraseña")

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'first_name', 'last_name' ,'role', 'genero', 'password1', 'password2']
    
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return password2

class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['cedula', 'telefono', 'fecha_nacimiento']

class MedicoForm(forms.ModelForm):
    class Meta:
        model = Medico
        fields = ['telefono']

class UploadExcelForm(forms.Form):
    excel_file = forms.FileField(
        label='Selecciona archivo Excel',
        help_text='Formatos soportados: .xlsx, .xls',
        widget=forms.FileInput(attrs={
            'accept': '.xlsx,.xls',
            'class': 'form-control-file'
        })
    )