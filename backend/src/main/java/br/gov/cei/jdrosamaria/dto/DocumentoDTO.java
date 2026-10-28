package br.gov.cei.jdrosamaria.dto;

import java.time.LocalDateTime;

public class DocumentoDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String fileUrl;
    private LocalDateTime date;
    private String status;

    public DocumentoDTO(Long id, String title, String description, String category, String fileUrl, LocalDateTime date, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.fileUrl = fileUrl;
        this.date = date;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getFileUrl() { return fileUrl; }
    public LocalDateTime getDate() { return date; }
    public String getStatus() { return status; }
}