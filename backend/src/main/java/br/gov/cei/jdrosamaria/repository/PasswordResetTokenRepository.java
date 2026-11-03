package br.gov.cei.jdrosamaria.repository;

import br.gov.cei.jdrosamaria.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    void deleteByUsuario_IdUsuario(Integer idUsuario);
}
