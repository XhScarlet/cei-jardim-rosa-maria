package br.gov.cei.jdrosamaria.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tb_post")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_post")
    private Integer idBlog;

    @Column(name = "tb_usuario_id_usuario")
    private Integer idUsuario;

    @Column(name = "titulo_post")
    private String tituloBlog;

    @Column(name = "categoria_post")
    private String categoriaBlog;

    @Column(name = "resumo_post")
    private String resumoBlog;

    @Column(name = "conteudo_post", columnDefinition = "TEXT")
    private String conteudoBlog;

    @Column(name = "imagem_post")
    private String imagemBlog; // só a URL

    @Column(name = "dt_post")
    private LocalDateTime dataBlog;

    @Column(name = "status_post")
    private String statusBlog;
}