document.addEventListener("DOMContentLoaded", function () {
    const participanteForm = document.getElementById("participanteForm");
    const disciplinaForm = document.getElementById("disciplinaForm");
    const eventoForm = document.getElementById("eventoForm");

    const resultadoParticipante = document.getElementById("resultadoParticipante");
    const resultadoDisciplina = document.getElementById("resultadoDisciplina");
    const resultadoEvento = document.getElementById("resultadoEvento");

    const participanteDisciplinaIdSelect = document.getElementById("participanteDisciplinaId");
    const eventoParticipanteIdSelect = document.getElementById("eventoParticipanteId");

    const consultaParticipantesForm = document.getElementById("consultaParticipantesForm");
    const consultaDisciplinasForm = document.getElementById("consultaDisciplinasForm");
    const consultaEventosForm = document.getElementById("consultaEventosForm");

    const resultadoConsultaParticipante = document.getElementById("resultadoConsultaParticipante");
    const resultadoConsultaDisciplina = document.getElementById("resultadoConsultaDisciplina");
    const resultadoConsultaEvento = document.getElementById("resultadoConsultaEvento");

    const eventosLista = document.getElementById("eventosLista"); // Contenedor para la lista de eventos

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
        const tipo = document.getElementById("disciplinaTipo").value; // Nuevo campo

        const disciplina = { id, nombre, tipo };

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
                obtenerEventos(); // Actualiza la lista de eventos
            } else {
                resultadoEvento.innerText = "Error al agregar evento";
            }
        });
    });

    // Consulta de Participante
    consultaParticipantesForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("consultaParticipanteId").value;

        fetch(`ParticipanteServlet?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    resultadoConsultaParticipante.innerText = `Participante: ${data.nombre} ${data.apellido} - Email: ${data.email}`;
                } else {
                    resultadoConsultaParticipante.innerText = "Participante no encontrado";
                }
            })
            .catch(error => {
                console.error('Error al consultar participante:', error);
                resultadoConsultaParticipante.innerText = "Error al consultar participante";
            });
    });

    // Consulta de Disciplina
    consultaDisciplinasForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("consultaDisciplinaId").value;

        fetch(`DisciplinaServlet?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    resultadoConsultaDisciplina.innerText = `Disciplina: ${data.nombre} - Tipo: ${data.tipo}`;
                } else {
                    resultadoConsultaDisciplina.innerText = "Disciplina no encontrada";
                }
            })
            .catch(error => {
                console.error('Error al consultar disciplina:', error);
                resultadoConsultaDisciplina.innerText = "Error al consultar disciplina";
            });
    });

    // Consulta de Evento
    consultaEventosForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("consultaEventoId").value;

        fetch(`EventoServlet?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    resultadoConsultaEvento.innerText = `Evento: ${data.nombre} - Fecha: ${data.fecha} - Resultado: ${data.resultado}`;
                } else {
                    resultadoConsultaEvento.innerText = "Evento no encontrado";
                }
            })
            .catch(error => {
                console.error('Error al consultar evento:', error);
                resultadoConsultaEvento.innerText = "Error al consultar evento";
            });
    });

    // Función para obtener y mostrar la lista de eventos
    function obtenerEventos() {
        fetch("EventoServlet")
            .then(response => response.json())
            .then(data => {
                eventosLista.innerHTML = ''; // Limpiar la lista actual
                data.forEach(evento => {
                    const li = document.createElement("li");
                    li.textContent = `Evento: ${evento.nombre} - Fecha: ${evento.fecha} - Resultado: ${evento.resultado} - Participante: ${evento.participante.nombre} ${evento.participante.apellido}`;
                    eventosLista.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error al obtener eventos:', error);
            });
    }

    // Llama a la función para obtener y mostrar los eventos al cargar la página
    obtenerEventos();
});
