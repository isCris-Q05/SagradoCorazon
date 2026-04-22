document.addEventListener('DOMContentLoaded', function() {
    const vistaTablaBtn = document.getElementById('vistaTablaBtn');
    const vistaTarjetasBtn = document.getElementById('vistaTarjetasBtn');
    const tablaPacientes = document.getElementById('tablaPacientes');
    const cardsPacientes = document.getElementById('cardsPacientes');
    
    // Función para activar tabla
    function activarTabla() {
        tablaPacientes.style.display = 'block';
        cardsPacientes.style.display = 'none';
        
        vistaTablaBtn.classList.remove('btn-outline-success');
        vistaTablaBtn.classList.add('btn-success', 'active');
        vistaTarjetasBtn.classList.remove('btn-success', 'active');
        vistaTarjetasBtn.classList.add('btn-outline-success');
    }
    
    // Función para activar tarjetas
    function activarTarjetas() {
        tablaPacientes.style.display = 'none';
        cardsPacientes.style.display = 'flex';
        
        vistaTarjetasBtn.classList.remove('btn-outline-success');
        vistaTarjetasBtn.classList.add('btn-success', 'active');
        vistaTablaBtn.classList.remove('btn-success', 'active');
        vistaTablaBtn.classList.add('btn-outline-success');
    }
    
    // Event listeners
    vistaTablaBtn.addEventListener('click', activarTabla);
    vistaTarjetasBtn.addEventListener('click', activarTarjetas);
    
    // Activar tabla por defecto
    activarTabla();
});