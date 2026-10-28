package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByStatusDocumento(String status);
}