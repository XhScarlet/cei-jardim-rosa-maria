package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Organizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizacaoRepository extends JpaRepository<Organizacao, Long> {
    Optional<Organizacao> findByUnidadeIdUnidade(Long idUnidade);
}