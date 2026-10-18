package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.ObjetivoMetas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ObjetivoMetasRepository extends JpaRepository<ObjetivoMetas, Long> {
    Optional<ObjetivoMetas> findByUnidadeIdUnidade(Long idUnidade);
}