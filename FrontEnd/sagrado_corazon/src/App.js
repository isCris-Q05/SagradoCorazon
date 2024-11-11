import logo from './logo.svg';
import './inicio.css';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';
import AppointmentDialog from "./components/AppointmentDialog";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';


function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div class="container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <a href="#" class="brand">
          <AssignmentIcon />
          <span>DermaCare</span>
        </a>
      </div>
      <nav class="sidebar-nav">
        <a href="#" class="nav-link active">Inicio</a>
        <a href="#" class="nav-link ">Doctores</a>
        <a href="#" class="nav-link">Productos</a>
        <a href="#" class="nav-link">Alergias</a>
        <a href="#" class="nav-link">Enfermedades</a>
        <a href="#" class="nav-link">Cerrar Sesión</a>
      </nav>
    </aside>

    <main class="content">
      <header class="header">
        <h1>Inicio</h1>
        <div class="header-actions">
          <NotificationsIcon />
          
          <AccountCircleIcon />
        </div>
      </header>

      <section class="actions">
        <input type="search" placeholder="Buscar cita..." class="search-input"/>
        <button class="button primary" onClick={toggleDialog}>Crear Cita</button>
        <button class="button primary">Agregar registro</button>
        <button class="button outline">Horario de Doctores</button>
      </section>

      <section class="appointments">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre completo </th>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Hora inicio</th>
              <th>Hora fin</th>
              <th>Doctor asignado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                 Cristopher Quintana
              </td>
              <td>Revision de lunares y mancha de piel</td>
              <td>8 Aug 2024</td>
              <td>12:00</td>
              <td>13:00</td>
              <td>Dra. Jurid Torres</td>
            </tr>
            <tr>
              <td>Josué Ruiz</td>
              <td>Cosnulta de evaluacion de piel</td>
              <td>8 Aug 2024</td>
              <td>14:00</td>
              <td>15:00</td>
              <td>Dra. Jurid Torres</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/*Componente de dialogo */}
      <AppointmentDialog isOpen={isDialogOpen} onClose={toggleDialog} />
      
    </main>
  </div>
  );
}

export default App;
