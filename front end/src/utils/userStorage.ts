export type Usuario = {
  nome?: string;
  foto?: string;
};

export function getUsuario(): Usuario | null {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function salvarUsuario(usuario: Usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}
