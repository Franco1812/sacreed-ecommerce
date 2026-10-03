/** Se muestra al instante al cambiar de pantalla, mientras la nueva pide sus datos a la API. */
export default function AdminLoading() {
  return (
    <p className="admin-hint" role="status">
      Cargando…
    </p>
  );
}
