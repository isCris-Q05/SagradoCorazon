// src/components/AppointmentDialog.js
import React from 'react';
import './AppointmentDialog.css';

export default function AppointmentDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Crear Cita</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form id="appointmentForm" className="form-grid">
          
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" className="form-control" placeholder="Ingrese su nombre" required />
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input type="date" id="date" name="date" className="form-control" required />
          </div>
          <div className="form-group time-group">
            <label>Hora</label>
            <div>
              <label htmlFor="from">Hora inicio</label>
              <input type="time" id="from" name="from" className="form-control" required />
            </div>
            <div>
              <label htmlFor="to">Hora final</label>
              <input type="time" id="to" name="to" className="form-control" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Descripción</label>
            <textarea id="notes" name="notes" className="form-control" placeholder="Notas adicionales sobre su condición"></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-btn">Reservar Cita</button>
          </div>
        </form>
      </div>
    </div>
  );
}
