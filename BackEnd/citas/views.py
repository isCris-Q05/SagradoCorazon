from django.shortcuts import render, HttpResponse, redirect
from .forms import FormularioBusqueda, RegistroUsuarioForm

# Create your views here.
def index(request):
    return render(request, "citas/index.html")

def buscar(request):
    if request.method == "POST":
        form = FormularioBusqueda(request.POST)
        if form.is_valid():
            busqueda = form.cleaned_data["busqueda"]
            return HttpResponse("Buscando: " + busqueda)
    else:
        form = FormularioBusqueda()
    return render(request, "citas/buscar.html", {"form": form})

def registrar_usuario(request):
    if request.method == "POST":
        form = RegistroUsuarioForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            return redirect("index")

    else:
        form = RegistroUsuarioForm()
    return render(request, "citas/registro.html", {"form": form})