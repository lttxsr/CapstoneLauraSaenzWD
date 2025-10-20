export function toast(message: string, type: "success" | "error" = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    });
    document.body.appendChild(container);
  }

  const div = document.createElement("div");
  Object.assign(div.style, {
    background: type === "success" ? "#0f662fff" : "#dc2626",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: ".9rem",
    fontWeight: "500",
    opacity: "0",
    transition: "opacity .3s ease, transform .3s ease",
    transform: "translateY(10px)",
  });
  div.textContent = message;
  container.appendChild(div);

  requestAnimationFrame(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translateY(10px)";
    setTimeout(() => div.remove(), 400);
  }, 3000);
}
