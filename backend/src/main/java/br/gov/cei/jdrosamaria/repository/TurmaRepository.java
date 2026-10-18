package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByUnidadeIdUnidade(Long idUnidade);
    void deleteByUnidadeIdUnidade(Long idUnidade);
}