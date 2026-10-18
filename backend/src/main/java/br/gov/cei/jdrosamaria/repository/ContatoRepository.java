package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContatoRepository extends JpaRepository<Contato, Long> {
    Optional<Contato> findByUnidadeIdUnidade(Long idUnidade);
}