package controlador;

import com.google.gson.Gson;
import dao.DisciplinaDAO;
import modelo.Disciplina;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/DisciplinaServlet")
public class DisciplinaServlet extends HttpServlet {
    private DisciplinaDAO disciplinaDAO = new DisciplinaDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        if (id != null) {
            Disciplina disciplina = disciplinaDAO.obtenerDisciplina(id);
            if (disciplina != null) {
                String json = gson.toJson(disciplina);
                resp.setContentType("application/json");
                resp.getWriter().write(json);
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Disciplina no encontrada");
            }
        } else {
            List<Disciplina> disciplinas = disciplinaDAO.obtenerTodasDisciplinas();
            String json = gson.toJson(disciplinas);
            resp.setContentType("application/json");
            resp.getWriter().write(json);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Disciplina disciplina = gson.fromJson(reader, Disciplina.class);
        disciplinaDAO.agregarDisciplina(disciplina);
        resp.setStatus(HttpServletResponse.SC_CREATED);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Disciplina disciplina = gson.fromJson(reader, Disciplina.class);
        disciplinaDAO.actualizarDisciplina(disciplina);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        disciplinaDAO.eliminarDisciplina(id);
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
