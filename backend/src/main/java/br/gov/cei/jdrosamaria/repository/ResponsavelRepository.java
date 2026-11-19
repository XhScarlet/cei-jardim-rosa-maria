package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Responsavel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResponsavelRepository extends JpaRepository<Responsavel, Integer> {
    List<Responsavel> findAllByOrderByIdResponsavelDesc();
}