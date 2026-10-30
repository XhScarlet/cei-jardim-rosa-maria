package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "TB_POST")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Post")
    private Long idBlog;

    @Column(name = "TB_USUARIO_Id_Usuario")
    private Long idUsuario;

    @Column(name = "Titulo_Post")
    private String tituloBlog;

    @Column(name = "Categoria_Post")
    private String categoriaBlog;

    @Column(name = "Resumo_Post")
    private String resumoBlog;

    @Column(name = "Conteudo_Post", columnDefinition = "TEXT")
    private String conteudoBlog;

    @Column(name = "Imagem_Post")
    private String imagemBlog; // só a URL

    @Column(name = "Dt_Post")
    private LocalDateTime dataBlog;

    @Column(name = "Status_Post")
    private String statusBlog;
}