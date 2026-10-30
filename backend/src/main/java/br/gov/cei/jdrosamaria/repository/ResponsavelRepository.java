package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Responsavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    List<Responsavel> findAllByOrderByIdResponsavelDesc();
}