package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Direcao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirecaoRepository extends JpaRepository<Direcao, Long> {
}
