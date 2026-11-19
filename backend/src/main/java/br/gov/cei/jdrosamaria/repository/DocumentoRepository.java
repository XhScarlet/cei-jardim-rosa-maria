package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {
    List<Documento> findByStatusDocumento(String status);
}