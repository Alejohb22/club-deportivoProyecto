package modelo;

import java.util.Date;

public class Evento {
    private String id;
    private String nombre;
    private Date fecha;
    private String resultado;
    private Participante participante;

    // Constructor
    public Evento(String id, String nombre, Date fecha, String resultado, Participante participante) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.resultado = resultado;
        this.participante = participante;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public Participante getParticipante() { return participante; }
    public void setParticipante(Participante participante) { this.participante = participante; }
}