package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmailUsuarioAndSenhaUsuario(String emailUsuario, String senhaUsuario);
}