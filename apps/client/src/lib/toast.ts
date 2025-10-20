type ToastType = "success" | "error" | "info" | "warning";

type ToastOptions = {
  dedupe?: boolean;
  key?: string;
  duration?: number;
};

let container: HTMLElement | null = null;
const activeKeys = new Set<string>();

function ensureContainer() {
  if (container) return container;
  const div = document.createElement("div");
  div.id = "toast-container";
  Object.assign(div.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  });
  document.body.appendChild(div);
  container = div;
  return container!;
}

export function toast(
  message: string,
  type: ToastType = "success",
  opts: ToastOptions = {}
) {
  const { dedupe = true, key, duration = 3000 } = opts;
  const k = key || `${type}:${message}`;

  if (dedupe && activeKeys.has(k)) {
    return () => {};
  }
  activeKeys.add(k);

  const host = ensureContainer();
  const div = document.createElement("div");
  Object.assign(div.style, {
    background:
      type === "error"
        ? "#dc2626"
        : type === "warning"
        ? "#d97706"
        : type === "info"
        ? "#2563eb"
        : "#16a34a",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: ".9rem",
    fontWeight: "500",
    opacity: "0",
    transition: "opacity .3s ease, transform .3s ease",
    transform: "translateY(10px)",
    maxWidth: "80vw",
  });
  div.textContent = message;
  host.appendChild(div);

  requestAnimationFrame(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  });

  const close = () => {
    div.style.opacity = "0";
    div.style.transform = "translateY(10px)";
    setTimeout(() => {
      div.remove();
      activeKeys.delete(k);
    }, 400);
  };

  const t = window.setTimeout(close, duration);
  return () => {
    clearTimeout(t);
    close();
  };
}

toast.once = (message: string, type: ToastType = "success", duration = 3000) =>
  toast(message, type, { dedupe: true, duration });
