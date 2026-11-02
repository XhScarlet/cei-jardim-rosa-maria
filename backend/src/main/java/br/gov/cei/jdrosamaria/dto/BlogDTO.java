package br.gov.cei.jdrosamaria.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogDTO {
    private Integer idBlog;
    private Integer idUsuario;
    private String tituloBlog;
    private String categoriaBlog;
    private String resumoBlog;
    private String conteudoBlog;
    private String imagemBlog;
    private LocalDateTime dataBlog;
    private String statusBlog;
}