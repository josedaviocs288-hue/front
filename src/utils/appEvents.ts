type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeAtualizacaoGlobal(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitirAtualizacaoGlobal() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.log("Erro ao notificar:", error);
    }
  });
}