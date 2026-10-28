package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_DOCUMENTO")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Documento")
    private Long idDocumento;

    @Column(name = "TB_USUARIO_Id_Usuario", nullable = false)
    private Long idUsuario;

    @Column(name = "Nome_Documento", nullable = false, length = 100)
    private String nomeDocumento;

    @Column(name = "Tipo_Documento", nullable = false, length = 50)
    private String tipoDocumento;

    @Column(name = "Desc_Documento", nullable = false, length = 255)
    private String descDocumento;

    @Column(name = "Arquivo_Documento", nullable = false, length = 255)
    private String arquivoDocumento;

    @Column(name = "Dt_Upload_Documento", nullable = false)
    private LocalDateTime dtUploadDocumento;

    @Column(name = "Status_Documento", nullable = false, length = 1)
    private String statusDocumento;

    public Documento() {}

    // Getters e Setters
    public Long getIdDocumento() { return idDocumento; }
    public void setIdDocumento(Long idDocumento) { this.idDocumento = idDocumento; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

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