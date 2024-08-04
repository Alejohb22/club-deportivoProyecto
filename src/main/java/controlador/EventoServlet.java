package controlador;

import com.google.gson.Gson;
import dao.EventoDAO;
import dao.ParticipanteDAO;
import modelo.Evento;
import modelo.Participante;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/EventoServlet")
public class EventoServlet extends HttpServlet {
    private EventoDAO eventoDAO = new EventoDAO();
    private ParticipanteDAO participanteDAO = new ParticipanteDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Evento> eventos = eventoDAO.obtenerTodosEventos();
        String json = gson.toJson(eventos);
        resp.setContentType("application/json");
        resp.getWriter().write(json);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Evento evento = gson.fromJson(reader, Evento.class);
        Participante participante = participanteDAO.obtenerParticipante(evento.getParticipante().getId());
        evento.setParticipante(participante);
        eventoDAO.agregarEvento(evento);
        resp.setStatus(HttpServletResponse.SC_CREATED);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Evento evento = gson.fromJson(reader, Evento.class);
        Participante participante = participanteDAO.obtenerParticipante(evento.getParticipante().getId());
        evento.setParticipante(participante);
        eventoDAO.actualizarEvento(evento);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        eventoDAO.eliminarEvento(id);
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}