package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import modelo.Evento;
import modelo.Participante;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EventoDAO {
    private MongoCollection<Document> collection;

    public EventoDAO() {
        MongoDatabase database = ConexionMongo.getDatabase();
        collection = database.getCollection("eventos");
    }

    public void agregarEvento(Evento evento) {
        Document doc = new Document("id", evento.getId())
                .append("nombre", evento.getNombre())
                .append("fecha", evento.getFecha())
                .append("resultado", evento.getResultado())
                .append("participante", evento.getParticipante().getId());
        collection.insertOne(doc);
    }

    public Evento obtenerEvento(String id) {
        Document doc = collection.find(Filters.eq("id", id)).first();
        if (doc != null) {
            ParticipanteDAO participanteDAO = new ParticipanteDAO();
            Participante participante = participanteDAO.obtenerParticipante(doc.getString("participante"));
            return new Evento(
                    doc.getString("id"),
                    doc.getString("nombre"),
                    doc.getDate("fecha"),
                    doc.getString("resultado"),
                    participante
            );
        }
        return null;
    }

    public List<Evento> obtenerTodosEventos() {
        List<Evento> eventos = new ArrayList<>();
        ParticipanteDAO participanteDAO = new ParticipanteDAO();
        for (Document doc : collection.find()) {
            Participante participante = participanteDAO.obtenerParticipante(doc.getString("participante"));
            Evento evento = new Evento(
                    doc.getString("id"),
                    doc.getString("nombre"),
                    doc.getDate("fecha"),
                    doc.getString("resultado"),
                    participante
            );
            eventos.add(evento);
        }
        return eventos;
    }

    public void actualizarEvento(Evento evento) {
        Bson filter = Filters.eq("id", evento.getId());
        Bson update = Updates.combine(
                Updates.set("nombre", evento.getNombre()),
                Updates.set("fecha", evento.getFecha()),
                Updates.set("resultado", evento.getResultado()),
                Updates.set("participante", evento.getParticipante().getId())
        );
        collection.updateOne(filter, update);
    }

    public void eliminarEvento(String id) {
        collection.deleteOne(Filters.eq("id", id));
    }
}