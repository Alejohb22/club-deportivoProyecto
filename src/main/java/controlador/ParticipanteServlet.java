package controlador;

import com.google.gson.Gson;
import dao.ParticipanteDAO;
import dao.DisciplinaDAO;
import modelo.Participante;
import modelo.Disciplina;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/ParticipanteServlet")
public class ParticipanteServlet extends HttpServlet {
    private ParticipanteDAO participanteDAO = new ParticipanteDAO();
    private DisciplinaDAO disciplinaDAO = new DisciplinaDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Participante> participantes = participanteDAO.obtenerTodosParticipantes();
        String json = gson.toJson(participantes);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Participante participante = gson.fromJson(reader, Participante.class);

        if (participanteDAO.estaInscritoEnDisciplina(participante.getId())) {
            resp.sendError(HttpServletResponse.SC_CONFLICT, "El participante ya está inscrito en una disciplina.");
            return;
        }

        Disciplina disciplina = disciplinaDAO.obtenerDisciplina(participante.getDisciplina().getId());
        participante.setDisciplina(disciplina);
        participanteDAO.agregarParticipante(participante);
        resp.setStatus(HttpServletResponse.SC_CREATED);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Participante participante = gson.fromJson(reader, Participante.class);

        if (participanteDAO.estaInscritoEnDisciplina(participante.getId())) {
            resp.sendError(HttpServletResponse.SC_CONFLICT, "El participante ya está inscrito en una disciplina.");
            return;
        }

        Disciplina disciplina = disciplinaDAO.obtenerDisciplina(participante.getDisciplina().getId());
        participante.setDisciplina(disciplina);
        participanteDAO.actualizarParticipante(participante);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        participanteDAO.eliminarParticipante(id);
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
