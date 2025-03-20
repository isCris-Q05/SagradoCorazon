document.addEventListener("DOMContentLoaded", function () {
    const notificationIcon = document.getElementById("notificationIcon");
    const notificationBar = document.getElementById("notificationBar");
    const clearNotifications = document.getElementById("clearNotifications");

    // Alternar la visibilidad de la barra de notificaciones
    notificationIcon.addEventListener("click", () => {
        const isVisible = notificationBar.style.display === "block";
        notificationBar.style.display = isVisible ? "none" : "block";
    });

    // Cerrar barra al presionar el botón "Cerrar"
    clearNotifications.addEventListener("click", () => {
        notificationBar.style.display = "none";
    });
});