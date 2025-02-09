const BASE_URL = "https://creatioapi-hsgvgfdrcxbjetds.canadacentral-01.azurewebsites.net/Contact";  // Reemplaza con la URL de producción si es necesario
//const BASE_URL = "https://localhost:7123/Contact"; 
/**
 * Obtiene datos de un contacto por ID
 */
async function getContact(id) {
    try {
        const response = await fetch(`${BASE_URL}/GetContact?id=${id}`);
        if (!response.ok) {
            throw new Error("No se pudo obtener el contacto.");
        }
        return response.json();
    } catch (error) {
        console.error("Error en getContact:", error);
        throw error;
    }
}

/**
 * Actualiza la información de un contacto
 */
async function updateContactData(contact) {
    try {
        const response = await fetch(`${BASE_URL}/UpdateContact`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error("No se pudo actualizar el contacto.");
        }
        return response.json();
    } catch (error) {
        console.error("Error en updateContactData:", error);
        throw error;
    }
}

/**
 * Sube múltiples archivos asociados a un contacto
 */
async function uploadMultipleFiles(contactId, files) {
    for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("contactId", contactId);

        console.log(`Subiendo archivo: ${file.name}`);

        try {
            const response = await fetch(`${BASE_URL}/attach`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error al subir archivo: ${file.name}`, errorText);
                throw new Error(`Error al subir archivo: ${file.name}`);
            }
        } catch (error) {
            console.error("Error en uploadMultipleFiles:", error);
            throw error;
        }
    }

    showAlert("success", "¡Todos los archivos fueron subidos correctamente!");
}
