import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerPerfil, actualizarPerfil } from '../services/clientes.service';
import UIkit from 'uikit';

function Perfil() {
  const { usuario, isEmpleado } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await obtenerPerfil();
        const data = res.data.data;
        setFormData({
          primerNombre: data.primerNombre || '',
          apellido: data.apellido || '',
          telefono: data.telefono || '',
          direccion: {
            calle: data.direccion?.calle || '',
            ciudad: data.direccion?.ciudad || '',
            departamento: data.direccion?.departamento || '',
            pais: data.direccion?.pais || '',
          },
          preferencias: {
            newsletter: data.preferencias?.newsletter || false,
          },
        });
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isEmpleado) fetchPerfil();
    else setLoading(false);
  }, [isEmpleado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('direccion.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [key]: value },
      }));
    } else if (name.startsWith('preferencias.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        preferencias: { ...prev.preferencias, [key]: type === 'checkbox' ? checked : value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await actualizarPerfil(formData);
      UIkit.notification({
        message: 'Perfil actualizado correctamente',
        status: 'success',
        pos: 'top-center',
        timeout: 2000,
      });
    } catch (error) {
      UIkit.notification({
        message: error.response?.data?.error || 'Error al actualizar perfil',
        status: 'danger',
        pos: 'top-center',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="uk-text-center uk-margin-large"><div data-uk-spinner="ratio: 2"></div></div>;
  }

  return (
    <div className="uk-section uk-flex uk-flex-middle" style={{ minHeight: '70vh' }}>
      <div className="uk-container uk-container-small">
        <div className="uk-card uk-card-default uk-card-body uk-border-rounded">
          <h2 className="uk-text-center" style={{ color: '#C98A40', fontWeight: 'bold' }}>Mi Perfil</h2>

          <form onSubmit={handleSubmit} className="uk-form-stacked uk-margin-top">
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Nombre</label>
                <input className="uk-input" type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} required />
              </div>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">Apellido</label>
                <input className="uk-input" type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Teléfono</label>
              <input className="uk-input" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" style={{ fontWeight: 'bold', color: '#584125' }}>Dirección</label>
              <input className="uk-input uk-margin-small-bottom" type="text" name="direccion.calle" placeholder="Calle" value={formData.direccion?.calle} onChange={handleChange} />
              <div className="uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2@s"><input className="uk-input" type="text" name="direccion.ciudad" placeholder="Ciudad" value={formData.direccion?.ciudad} onChange={handleChange} /></div>
                <div className="uk-width-1-2@s"><input className="uk-input" type="text" name="direccion.departamento" placeholder="Departamento" value={formData.direccion?.departamento} onChange={handleChange} /></div>
              </div>
              <input className="uk-input uk-margin-small-top" type="text" name="direccion.pais" placeholder="País" value={formData.direccion?.pais} onChange={handleChange} />
            </div>

            <div className="uk-margin">
              <label>
                <input className="uk-checkbox" type="checkbox" name="preferencias.newsletter" checked={formData.preferencias?.newsletter} onChange={handleChange} />{' '}
                Recibir noticias y ofertas por correo
              </label>
            </div>

            <button type="submit" className="uk-button uk-button-primary uk-width-1-1" style={{ borderRadius: '25px' }} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
