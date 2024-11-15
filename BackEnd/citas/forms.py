from django import forms

class FormularioBusqueda(forms.Form):
    busqueda = forms.CharField(label='Busqueda', max_length=100)

class RegistroUsuarioForm(forms.Form):
    username = forms.CharField(max_length=150, required=True, label="Nombre de usuario")
    email = forms.EmailField(required=True, label="Correo electrónico")

