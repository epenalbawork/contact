document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname.split("/").pop();
    const contactId = "c38d46fd-e405-491a-a508-01bb9760eecc"; // ID predeterminado

    try {
        showLoading(); // Mostrar el spinner antes de cargar

        if (currentPage === "formulario.html") {
            initializeForm();
            setTimeout(() => {
                initializeDropzone(); // Asegurar que los elementos existen antes de inicializar el dropzone
            }, 500); // ⏳ Esperar un poco para asegurarse de que la página cargó
        }
    } catch (error) {
        console.error("❌ Error al cargar el contacto automáticamente:", error);
    } finally {
        hideLoading(); // Ocultar el spinner
    }
});

// **Inicializar el formulario y cargar el contacto**
function initializeForm() {
    console.log("✅ Inicializando formulario...");

    const contactIdField = document.getElementById("contactId");
    if (!contactIdField) {
        console.error("❌ Error: No se encontró el formulario en el DOM.");
        return;
    }

    // Obtener contacto si estamos en formulario.html
    const contactId = "c38d46fd-e405-491a-a508-01bb9760eecc";
    fetchContact(contactId);
}

// **Función para mostrar alertas bonitas**
function showAlert(type, message) {
    Swal.fire({
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 5000,
        toast: true,
        position: "top-end"
    });
}

// **Función para buscar el contacto**
async function fetchContact(contactId) {
    if (!contactId) {
        showAlert("warning", "Por favor, ingrese un ID válido.");
        return;
    }

    try {
        showLoading();
        const contact = await getContact(contactId);

        if (!contact) {
            showAlert("error", "No se encontró el contacto.");
            return;
        }

        // Llenar los campos del formulario
        setFormValues(contactId, contact);
        document.getElementById("contactForm").classList.remove("hidden");

        showAlert("success", "¡Contacto encontrado con éxito!");
    } catch (error) {
        showAlert("error", "Error al obtener el contacto.");
    } finally {
        hideLoading();
    }
}

// **Función para llenar el formulario con los datos del contacto**
function setFormValues(contactId, contact) {
    function setValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || "";
        } else {
            console.warn(`⚠️ Advertencia: No se encontró el elemento con ID "${id}"`);
        }
    }

    setValue("contactId", contactId);
    setValue("name", contact.name);
    setValue("jobTitle", contact.jobTitle);
    setValue("birthDate", contact.birthDate ? contact.birthDate.split("T")[0] : "");
    setValue("phone", contact.phone);
    setValue("mobilePhone", contact.mobilePhone);
    setValue("email", contact.email);
    setValue("address", contact.address);
    setValue("surname", contact.surname);
    setValue("middleName", contact.middleName);
    setValue("age", contact.age);
    setValue("inn", contact.inn);
    setValue("placeOfBirth", contact.placeOfBirth);
}

// **Manejo de archivos**
let selectedFiles = [];

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "formulario.html") {
        initializeDropzone();
    }
});

function initializeDropzone() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");

    if (!dropzone || !fileInput) {
        console.error("❌ Error: No se encontró #dropzone o #fileInput en el DOM.");
        return;
    }

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (event) => {
        selectedFiles.push(...event.target.files);
        updateFileList();
    });

    dropzone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropzone.classList.add("border-blue-500");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("border-blue-500");
    });

    dropzone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropzone.classList.remove("border-blue-500");

        for (let file of event.dataTransfer.files) {
            selectedFiles.push(file);
        }
        updateFileList();
    });

    console.log("✅ Dropzone inicializado correctamente.");
}


// **Actualizar la lista de archivos adjuntos**
function updateFileList() {
    const fileList = document.getElementById("fileList");
    if (!fileList) {
        console.error("❌ Error: No se encontró #fileList en el DOM.");
        return;
    }

    fileList.innerHTML = "";
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement("li");
        fileItem.className = "flex justify-between items-center bg-gray-100 p-2 rounded-md";

        fileItem.innerHTML = `
            <span class="text-sm text-gray-700">${file.name}</span>
            <button onclick="removeFile(${index})" class="text-red-500 text-sm font-semibold">Eliminar</button>
        `;

        fileList.appendChild(fileItem);
    });
}

// **Eliminar un archivo antes de enviarlo**
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
}

// **Actualizar contacto**
async function updateContact() {
    const contactId = document.getElementById("contactId").value;
    if (!contactId) {
        showAlert("warning", "Debe ingresar un ID de contacto.");
        return;
    }

    try {
        showLoading();
        const contact = await getContact(contactId);

        let birthDateValue = document.getElementById("birthDate").value;
        let formattedBirthDate = birthDateValue ? new Date(birthDateValue).toISOString() : contact.birthDate;

        const updatedContact = {
            Id: contactId,
            Name: document.getElementById("name").value || contact.name,
            JobTitle: document.getElementById("jobTitle").value || contact.jobTitle,
            BirthDate: formattedBirthDate,
            Phone: document.getElementById("phone").value || contact.phone,
            MobilePhone: document.getElementById("mobilePhone").value || contact.mobilePhone,
            Email: document.getElementById("email").value || contact.email,
            Address: document.getElementById("address").value || contact.address,
            Surname: document.getElementById("surname").value || contact.surname,
            MiddleName: document.getElementById("middleName").value || contact.middleName,
            Age: document.getElementById("age").value || contact.age,
            INN: document.getElementById("inn").value || contact.inn,
            PlaceOfBirth: document.getElementById("placeOfBirth").value || contact.placeOfBirth
        };

        await updateContactData(updatedContact);

        if (selectedFiles.length > 0) {
            await uploadMultipleFiles(contactId, selectedFiles);
            selectedFiles = [];
            updateFileList();
        }

        showAlert("success", "¡Contacto actualizado con éxito!");
    } catch (error) {
        showAlert("error", "Error al actualizar el contacto.");
    } finally {
        hideLoading();
    }
}

async function confirmUpdateContact() {
    const contactId = document.getElementById("contactId").value;
    if (!contactId) {
        showAlert("warning", "Debe ingresar un ID de contacto.");
        return;
    }

    try {
        showLoading();

        // Obtener los datos actuales del contacto desde la API antes de actualizar
        const originalContact = await getContact(contactId);

        // Obtener los valores editados en el formulario
        const updatedContact = {
            Email: document.getElementById("email").value || "",
            Nombre: document.getElementById("name").value || "",
            "Puesto de Trabajo": document.getElementById("jobTitle").value || "",
            "Fecha de Nacimiento": document.getElementById("birthDate").value || "",
            Teléfono: document.getElementById("phone").value || "",
            Móvil: document.getElementById("mobilePhone").value || "",
           
            Dirección: document.getElementById("address").value || "",
            Apellido: document.getElementById("surname").value || "",
            "Segundo Nombre": document.getElementById("middleName").value || "",
            Edad: document.getElementById("age").value || "",
            Cédula: document.getElementById("inn").value || "",
            "Lugar de Nacimiento": document.getElementById("placeOfBirth").value || ""
        };

        // Crear la estructura del mensaje con los datos editados
        let formattedData = `<ul style="text-align:left;">`;

        Object.keys(updatedContact).forEach(key => {
            const inputId = key.replace(/\s+/g, '').toLowerCase(); // Convertir a formato de ID de input
            const newValue = updatedContact[key].trim(); // Eliminar espacios en blanco extra
            const oldValue = originalContact[inputId] ? originalContact[inputId].trim() : ""; // Acceder correctamente al dato original

            // Aplicar color verde SOLO si el valor ha cambiado
            const colorStyle = newValue !== oldValue ? "color: #27ae60; font-weight: bold;" : "color: inherit;";
            formattedData += `<li><strong>${key}:</strong> <span style="${colorStyle}">${newValue || "No especificado"}</span></li>`;
        });

        formattedData += `</ul>`;

        // Mostrar el modal de confirmación con los datos editados
        Swal.fire({
            title: "¿Está seguro de actualizar estos datos?",
            html: formattedData,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                updateContact(); // Llamar a la función que actualiza el contacto
            }
        });
    } catch (error) {
        showAlert("error", "Error al obtener los datos actuales del contacto.");
    } finally {
        hideLoading();
    }
}


// **Manejo del spinner de carga**
function showLoading() {
  
    const spinner = document.getElementById("loadingSpinner");
    if (!spinner) {
        console.error("❌ Error: No se encontró #loadingSpinner en el DOM.");
        return;
    }
    spinner.classList.add("loading"); // ✅ Agregar clase `loading`
 
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}
function hideLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) {
        spinner.classList.remove("loading"); // ✅ Quitar la clase `loading`
        document.querySelectorAll("button").forEach(btn => btn.disabled = false); // 🔹 Habilita botones
    }
}

function loadPage(page) {
    console.log(`🔄 Cargando página: ${page}`);

    fetch(`/pages/${page}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;

            // ✅ Llamar funciones adicionales según la página cargada
            if (page === "formulario.html") {
                initializeForm();
                initializeDropzone();
            }

            // ✅ Actualizar la clase activa en los botones de las pestañas
            document.querySelectorAll(".tab-button").forEach(button => {
                button.classList.remove("active-tab");
            });

            // ✅ Agregar la clase activa al botón correcto
            const activeButton = document.querySelector(`button[onclick="loadPage('${page}')"]`);
            if (activeButton) {
                activeButton.classList.add("active-tab");
            } else {
                console.warn(`⚠️ Advertencia: No se encontró el botón para la página ${page}`);
            }
        })
        .catch(error => console.error("❌ Error cargando la página:", error));
}

 // Función para mostrar información sobre el OCR
function showOcrInfo() {
    Swal.fire({
        icon: "info",
        title: "¿Por qué usar OCR?",
        text: "Mediante OCR podemos extraer información de la cédula automáticamente y llenar el formulario mucho más rápido. 🚀",
        confirmButtonText: "Entendido"
    });
}

// Función para cambiar entre las pestañas
function showTab(tabId, event = null) {
    console.log(`🔄 Cambiando a la pestaña: ${tabId}`);

    // Verificar si existe el tabId en el DOM
    const selectedTab = document.getElementById(tabId);
    if (!selectedTab) {
        console.error(`❌ Error: No se encontró la pestaña con ID "${tabId}"`);
        return;
    }

    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Mostrar la pestaña seleccionada
    selectedTab.classList.remove('hidden');

    // Verificar si existen botones en el DOM antes de modificar clases
    const buttons = document.querySelectorAll('.tab-button');
    if (buttons.length === 0) {
        console.error("❌ Error: No se encontraron botones con la clase .tab-button");
        return;
    }

    // Quitar la clase activa de todos los botones
    buttons.forEach(button => {
        button.classList.remove('active-tab');
    });

    // Si el evento existe (cuando se llama desde un botón), asignarle la clase activa
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active-tab');
    }
}
// **Cargar la primera página por defecto**
document.addEventListener("DOMContentLoaded", function () {
    loadPage("formulario.html");
});
