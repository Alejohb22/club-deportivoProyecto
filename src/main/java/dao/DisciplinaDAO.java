package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import dao.ConexionMongo;
import modelo.Disciplina;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.util.ArrayList;
import java.util.List;

public class DisciplinaDAO {
    private MongoCollection<Document> collection;

    public DisciplinaDAO() {
        MongoDatabase database = ConexionMongo.getDatabase();
        collection = database.getCollection("disciplinas");
    }

    public void agregarDisciplina(Disciplina disciplina) {
        Document doc = new Document("id", disciplina.getId())
                .append("nombre", disciplina.getNombre());
        collection.insertOne(doc);
    }

    public Disciplina obtenerDisciplina(String id) {
        Document doc = collection.find(Filters.eq("id", id)).first();
        if (doc != null) {
            return new Disciplina(doc.getString("id"), doc.getString("nombre"));
        }
        return null;
    }

    public List<Disciplina> obtenerTodasDisciplinas() {
        List<Disciplina> disciplinas = new ArrayList<>();
        for (Document doc : collection.find()) {
            Disciplina disciplina = new Disciplina(
                    doc.getString("id"),
                    doc.getString("nombre")
            );
            disciplinas.add(disciplina);
        }
        return disciplinas;
    }

    public void actualizarDisciplina(Disciplina disciplina) {
        Bson filter = Filters.eq("id", disciplina.getId());
        Bson update = Updates.combine(
                Updates.set("nombre", disciplina.getNombre())
        );
        collection.updateOne(filter, update);
    }

    public void eliminarDisciplina(String id) {
        collection.deleteOne(Filters.eq("id", id));
    }
}