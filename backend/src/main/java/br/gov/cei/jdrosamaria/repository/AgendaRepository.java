package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {
}