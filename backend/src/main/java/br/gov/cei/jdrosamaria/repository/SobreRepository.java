package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Sobre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SobreRepository extends JpaRepository<Sobre, Long> {
    Optional<Sobre> findByUnidadeIdUnidade(Long idUnidade);
}