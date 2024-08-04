document.addEventListener("DOMContentLoaded", function () {
    const participanteForm = document.getElementById("participanteForm");
    const disciplinaForm = document.getElementById("disciplinaForm");
    const eventoForm = document.getElementById("eventoForm");

    const resultadoParticipante = document.getElementById("resultadoParticipante");
    const resultadoDisciplina = document.getElementById("resultadoDisciplina");
    const resultadoEvento = document.getElementById("resultadoEvento");

    const participanteDisciplinaIdSelect = document.getElementById("participanteDisciplinaId");
    const eventoParticipanteIdSelect = document.getElementById("eventoParticipanteId");

    // Función para obtener datos y llenar un <select>
    function llenarSelect(url, selectElement, textCallback) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Verifica los datos recibidos
                selectElement.innerHTML = ''; // Limpiar las opciones actuales
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.id;
                    option.text = textCallback(item); // Usa el callback para construir el texto
                    selectElement.add(option);
                });
            })
            .catch(error => console.error('Error al obtener los datos:', error));
    }

    // Obtener disciplinas y participantes al cargar la página
    llenarSelect("DisciplinaServlet", participanteDisciplinaIdSelect, item => item.nombre);

    // Obtener participantes para la lista de eventos
    llenarSelect("ParticipanteServlet", eventoParticipanteIdSelect, item => `${item.nombre} ${item.apellido} (ID: ${item.id})`);

    // Agregar Participante
    participanteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("participanteId").value;
        const nombre = document.getElementById("participanteNombre").value;
        const apellido = document.getElementById("participanteApellido").value;
        const email = document.getElementById("participanteEmail").value;
        const disciplinaId = participanteDisciplinaIdSelect.value;

        const participante = { id, nombre, apellido, email, disciplina: { id: disciplinaId } };

        fetch("ParticipanteServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participante)
        }).then(response => {
            if (response.ok) {
                resultadoParticipante.innerText = "Participante agregado exitosamente";
                participanteForm.reset(); // Limpia el formulario
                llenarSelect("ParticipanteServlet", eventoParticipanteIdSelect, item => `${item.nombre} ${item.apellido} (ID: ${item.id})`); // Actualiza lista de participantes
            } else {
                resultadoParticipante.innerText = "Error al agregar participante";
            }
        });
    });

    // Agregar Disciplina
    disciplinaForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("disciplinaId").value;
        const nombre = document.getElementById("disciplinaNombre").value;

        const disciplina = { id, nombre };

        fetch("DisciplinaServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(disciplina)
        }).then(response => {
            if (response.ok) {
                resultadoDisciplina.innerText = "Disciplina agregada exitosamente";
                disciplinaForm.reset(); // Limpia el formulario
                llenarSelect("DisciplinaServlet", participanteDisciplinaIdSelect, item => item.nombre);
            } else {
                resultadoDisciplina.innerText = "Error al agregar disciplina";
            }
        });
    });

    // Agregar Evento
    eventoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("eventoId").value;
        const nombre = document.getElementById("eventoNombre").value;
        const fecha = document.getElementById("eventoFecha").value;
        const resultado = document.getElementById("eventoResultado").value;
        const participanteId = eventoParticipanteIdSelect.value;

        const evento = { id, nombre, fecha, resultado, participante: { id: participanteId } };

        fetch("EventoServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(evento)
        }).then(response => {
            if (response.ok) {
                resultadoEvento.innerText = "Evento agregado exitosamente";
                eventoForm.reset(); // Limpia el formulario
                // Opcional: Actualizar la lista de eventos si es necesario
            } else {
                resultadoEvento.innerText = "Error al agregar evento";
            }
        });
    });
});
