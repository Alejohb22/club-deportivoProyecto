document.addEventListener("DOMContentLoaded", function () {
    const participanteForm = document.getElementById("participanteForm");
    const disciplinaForm = document.getElementById("disciplinaForm");
    const eventoForm = document.getElementById("eventoForm");

    const resultadoParticipante = document.getElementById("resultadoParticipante");
    const resultadoDisciplina = document.getElementById("resultadoDisciplina");
    const resultadoEvento = document.getElementById("resultadoEvento");

    const participanteDisciplinaIdSelect = document.getElementById("participanteDisciplinaId");
    const eventoParticipanteIdSelect = document.getElementById("eventoParticipanteId");

    // Obtener disciplinas
    fetch("DisciplinaServlet")
        .then(response => response.json())
        .then(data => {
            data.forEach(disciplina => {
                const option = document.createElement("option");
                option.value = disciplina.id;
                option.text = disciplina.nombre;
                participanteDisciplinaIdSelect.add(option);
            });
        });

    // Obtener participantes
    fetch("ParticipanteServlet")
        .then(response => response.json())
        .then(data => {
            data.forEach(participante => {
                const option = document.createElement("option");
                option.value = participante.id;
                option.text = participante.nombre + " " + participante.apellido;
                eventoParticipanteIdSelect.add(option);
            });
        });

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
            if (response.status === 201) {
                resultadoParticipante.innerText = "Participante agregado exitosamente";
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
            if (response.status === 201) {
                resultadoDisciplina.innerText = "Disciplina agregada exitosamente";
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
            if (response.status === 201) {
                resultadoEvento.innerText = "Evento agregado exitosamente";
            } else {
                resultadoEvento.innerText = "Error al agregar evento";
            }
        });
    });
});
