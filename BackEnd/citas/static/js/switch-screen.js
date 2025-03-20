document.getElementById('btnPaciente').addEventListener('change', function() {
    document.getElementById('formPaciente').style.display = 'block';
    document.getElementById('formMedico').style.display = 'none';
});

document.getElementById('btnMedico').addEventListener('change', function() {
    document.getElementById('formPaciente').style.display = 'none';
    document.getElementById('formMedico').style.display = 'block';
});