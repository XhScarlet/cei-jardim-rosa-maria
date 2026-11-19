package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AgendaRepository extends JpaRepository<Agenda, Integer> {
    long countByDataAgendaGreaterThanEqualAndStatusAgendaIgnoreCase(LocalDate data, String status);
    List<Agenda> findTop3ByDataAgendaGreaterThanEqualAndStatusAgendaIgnoreCaseOrderByDataAgendaAsc(
            LocalDate data, String status);
}