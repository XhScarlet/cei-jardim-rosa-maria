package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_documento")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer idDocumento;

    @Column(name = "tb_usuario_id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "nome_documento", nullable = false, length = 100)
    private String nomeDocumento;

    @Column(name = "tipo_documento", nullable = false, length = 50)
    private String tipoDocumento;

    @Column(name = "desc_documento", nullable = false, length = 255)
    private String descDocumento;

    @Column(name = "arquivo_documento", nullable = false, length = 255)
    private String arquivoDocumento;

    @Column(name = "dt_upload_documento", nullable = false)
    private LocalDateTime dtUploadDocumento;

    @Column(name = "status_documento", nullable = false, length = 1)
    private String statusDocumento;

    public Documento() {}

    // Getters e Setters
    public Integer getIdDocumento() { return idDocumento; }
    public void setIdDocumento(Integer idDocumento) { this.idDocumento = idDocumento; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getNomeDocumento() { return nomeDocumento; }
    public void setNomeDocumento(String nomeDocumento) { this.nomeDocumento = nomeDocumento; }

    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }

    public String getDescDocumento() { return descDocumento; }
    public void setDescDocumento(String descDocumento) { this.descDocumento = descDocumento; }

    public String getArquivoDocumento() { return arquivoDocumento; }
    public void setArquivoDocumento(String arquivoDocumento) { this.arquivoDocumento = arquivoDocumento; }

    public LocalDateTime getDtUploadDocumento() { return dtUploadDocumento; }
    public void setDtUploadDocumento(LocalDateTime dtUploadDocumento) { this.dtUploadDocumento = dtUploadDocumento; }

    public String getStatusDocumento() { return statusDocumento; }
    public void setStatusDocumento(String statusDocumento) { this.statusDocumento = statusDocumento; }
}