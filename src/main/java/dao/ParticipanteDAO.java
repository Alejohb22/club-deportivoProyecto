package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import modelo.Participante;
import modelo.Disciplina;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.ArrayList;
import java.util.List;

public class ParticipanteDAO {
    private MongoCollection<Document> collection;

    public ParticipanteDAO() {
        MongoDatabase database = ConexionMongo.getDatabase();
        collection = database.getCollection("participantes");
    }

    public void agregarParticipante(Participante participante) {
        Document doc = new Document("id", participante.getId())
                .append("nombre", participante.getNombre())
                .append("apellido", participante.getApellido())
                .append("email", participante.getEmail())
                .append("disciplina", participante.getDisciplina().getId());
        collection.insertOne(doc);
    }

    public Participante obtenerParticipante(String id) {
        Document doc = collection.find(Filters.eq("id", id)).first();
        if (doc != null) {
            DisciplinaDAO disciplinaDAO = new DisciplinaDAO();
            Disciplina disciplina = disciplinaDAO.obtenerDisciplina(doc.getString("disciplina"));
            return new Participante(
                    doc.getString("id"),
                    doc.getString("nombre"),
                    doc.getString("apellido"),
                    doc.getString("email"),
                    disciplina
            );
        }
        return null;
    }

    public List<Participante> obtenerTodosParticipantes() {
        List<Participante> participantes = new ArrayList<>();
        DisciplinaDAO disciplinaDAO = new DisciplinaDAO();
        for (Document doc : collection.find()) {
            Disciplina disciplina = disciplinaDAO.obtenerDisciplina(doc.getString("disciplina"));
            Participante participante = new Participante(
                    doc.getString("id"),
                    doc.getString("nombre"),
                    doc.getString("apellido"),
                    doc.getString("email"),
                    disciplina
            );
            participantes.add(participante);
        }
        return participantes;
    }

    public void actualizarParticipante(Participante participante) {
        Bson filter = Filters.eq("id", participante.getId());
        Bson update = Updates.combine(
                Updates.set("nombre", participante.getNombre()),
                Updates.set("apellido", participante.getApellido()),
                Updates.set("email", participante.getEmail()),
                Updates.set("disciplina", participante.getDisciplina().getId())
        );
        collection.updateOne(filter, update);
    }

    public void eliminarParticipante(String id) {
        collection.deleteOne(Filters.eq("id", id));
    }
}