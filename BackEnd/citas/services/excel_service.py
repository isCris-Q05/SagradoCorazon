import pandas as pd
from citas.models import Cita
from usuarios.models import Paciente, Medico, Usuario, Especialidad

# Single Responsibility Principle (SRP): Esta clase abstrae y maneja toda la lógica compleja 
# de parsear, validar y crear citas desde un archivo Excel, liberando a la vista de esta responsabilidad.
class ExcelUploadService:
    @staticmethod
    def process_excel(excel_file):
        response_data = {'status': 'success', 'message': '', 'created': 0, 'skipped': 0, 'errors': []}
        try:
            xls = pd.ExcelFile(excel_file)

            for sheet_name in xls.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
            
                column_mapping = {
                    'cedula': ['cedula', 'cédula', 'cédula_paciente'],
                    'id_cita': ['id_cita', 'idcita', 'cita', 'n°_cita'],
                    'medico_user': ['medico_user', 'medicouser', 'username_medico', 'usuario_medico'],
                    'fecha': ['fecha', 'fecha_cita'],
                    'hora': ['hora', 'hora_cita', 'hora_cita'],
                    'id_especialidad': ['id_especialidad', 'especialidad'],
                    'estado': ['estado', 'estado_cita']
                }
            
                missing_cols = []
                for key, aliases in column_mapping.items():
                    if not any(alias in df.columns for alias in aliases):
                        missing_cols.append(key)
            
                if missing_cols:
                    return {'status': 'error', 'message': f'Columnas requeridas faltantes: {", ".join(missing_cols)}'}
            
                df = df.rename(columns={
                    next(alias for alias in column_mapping['cedula'] if alias in df.columns): 'cedula',
                    next(alias for alias in column_mapping['id_cita'] if alias in df.columns): 'id_cita',
                    next(alias for alias in column_mapping['medico_user'] if alias in df.columns): 'medico_user',
                    next(alias for alias in column_mapping['fecha'] if alias in df.columns): 'fecha',
                    next(alias for alias in column_mapping['hora'] if alias in df.columns): 'hora',
                    next(alias for alias in column_mapping['estado'] if alias in df.columns): 'estado',
                    next(alias for alias in column_mapping['id_especialidad'] if alias in df.columns): 'especialidad',
                })
            
                for index, row in df.iterrows():
                    try:
                        if pd.isna(row['id_cita']):
                            continue
                        
                        if Cita.objects.filter(id_cita=row['id_cita']).exists():
                            response_data['skipped'] += 1
                            continue
                        
                        try:
                            paciente = Paciente.objects.get(cedula=row['cedula'])
                        except Paciente.DoesNotExist:
                            response_data['errors'].append(f"Fila {index+1}: Paciente con cédula {row['cedula']} no encontrado")
                            continue
                        
                        try:
                            medico_user = Usuario.objects.get(username=row['medico_user'], role='Medico')
                            medico = Medico.objects.get(user=medico_user)
                        except Usuario.DoesNotExist:
                            response_data['errors'].append(f"Hoja '{sheet_name}', Fila {index+2}: Médico con username {row['medico_user']} no encontrado")                            
                            continue
                        except Medico.DoesNotExist:
                            response_data['errors'].append(f"Hoja '{sheet_name}', Fila {index+2}: Perfil médico no existe para {row['medico_user']}")                            
                            continue
                        
                        try:
                            fecha = pd.to_datetime(row['fecha']).date()
                            hora = pd.to_datetime(row['hora']).time()
                        except Exception as e:
                            response_data['errors'].append(f"Hoja '{sheet_name}', Fila {index+2}: Error en fecha/hora - {str(e)}")
                            continue

                        try:
                            if pd.isna(row['especialidad']):
                                raise ValueError("Especialidad no proporcionada")
                            
                            especialidad_nombre = str(row['especialidad']).strip()

                            especialidad = Especialidad.objects.filter(nombre__iexact=especialidad_nombre).first()

                            if not especialidad:
                                response_data['errors'].append(
                                    f"Hoja '{sheet_name}', Fila {index+2}: Especialidad '{row['especialidad']}' no encontrada."
                                )
                                continue

                        except Exception as e:
                            response_data['errors'].append(f"Hoja '{sheet_name}', Fila {index+2}: Error en especialidad - {str(e)}")
                            continue  

                        Cita.objects.create(
                            id_cita=row['id_cita'],
                            id_paciente=paciente,
                            id_medico=medico,
                            fecha=fecha,
                            hora=hora,
                            id_especialidad=especialidad,
                            estado=row['estado']
                        )
                        response_data['created'] += 1
                        
                    except Exception as e:
                        response_data['errors'].append(f"Hoja '{sheet_name}', Fila {index+2}: Error - {str(e)}")
                        continue
            
            if response_data['errors']:
                response_data['status'] = 'partial'
            
            response_data['message'] = (
                f"Procesado: {response_data['created']} nuevas citas, "
                f"{response_data['skipped']} existentes, "
                f"{len(response_data['errors'])} errores"
            )
            
            return response_data
        
        except Exception as e:
            return {'status': 'error', 'message': f'Error al procesar el archivo: {str(e)}'}
