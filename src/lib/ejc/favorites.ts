// EJC — Favoritos de documentos (persistência local, item de UX)
// Guarda slugs dos documentos marcados pelo usuário; sincroniza entre componentes
// via evento CustomEvent('ejc:favoritos').

const KEY = 'ejc-favoritos';

export function lerFavoritos(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function ehFavorito(slug: string): boolean {
  return lerFavoritos().includes(slug);
}

export function alternarFavorito(slug: string): boolean {
  const atual = lerFavoritos();
  const existe = atual.includes(slug);
  const proximo = existe ? atual.filter((s) => s !== slug) : [slug, ...atual].slice(0, 200);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(proximo));
  } catch {
    /* storage indisponível — favoritos são acessórios */
  }
  window.dispatchEvent(new CustomEvent('ejc:favoritos', { detail: { slug, favorito: !existe } }));
  return !existe;
}

export function observarFavoritos(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('ejc:favoritos', cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener('ejc:favoritos', cb);
    window.removeEventListener('storage', cb);
  };
}
