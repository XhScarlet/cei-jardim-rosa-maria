package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    Optional<Horario> findByUnidadeIdUnidade(Integer idUnidade);
}