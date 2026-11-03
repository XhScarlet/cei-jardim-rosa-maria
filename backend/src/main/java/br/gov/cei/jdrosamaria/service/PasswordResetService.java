package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.PasswordResetRequest;
import br.gov.cei.jdrosamaria.model.PasswordResetToken;
import br.gov.cei.jdrosamaria.model.Usuario;
import br.gov.cei.jdrosamaria.repository.PasswordResetTokenRepository;
import br.gov.cei.jdrosamaria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class PasswordResetService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordResetTokenRepository tokenRepository,
                                JavaMailSender mailSender) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public void solicitar(String email) {
        if (email == null || email.isBlank()) return;
        usuarioRepository.findByEmailUsuarioIgnoreCase(email.trim())
                .filter(usuario -> "A".equalsIgnoreCase(usuario.getStatusUsuario()))
                .ifPresent(usuario -> enviarLink(usuario));
    }

    @Transactional
    public boolean redefinir(PasswordResetRequest request) {
        if (request == null || request.getToken() == null || request.getEmail() == null
                || request.getSenha() == null || request.getSenha().length() < 8
                || request.getSenha().length() > 25) return false;

        var tokenOpt = tokenRepository.findByTokenHash(hash(request.getToken()));
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken resetToken = tokenOpt.get();
        Usuario usuario = resetToken.getUsuario();
        if (!usuario.getEmailUsuario().equalsIgnoreCase(request.getEmail().trim())
                || resetToken.getExpiresAt().isBefore(Instant.now())) {
            tokenRepository.delete(resetToken);
            return false;
        }

        usuario.setSenhaUsuario(request.getSenha());
        usuarioRepository.save(usuario);
        tokenRepository.deleteByUsuario_IdUsuario(usuario.getIdUsuario());
        return true;
    }

    private void enviarLink(Usuario usuario) {
        tokenRepository.deleteByUsuario_IdUsuario(usuario.getIdUsuario());
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsuario(usuario);
        resetToken.setTokenHash(hash(token));
        resetToken.setExpiresAt(Instant.now().plusSeconds(30 * 60));
        tokenRepository.save(resetToken);

        String link = frontendUrl.replaceAll("/$", "") + "/login.html?token=" + token
                + "&email=" + java.net.URLEncoder.encode(usuario.getEmailUsuario(), StandardCharsets.UTF_8);
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) message.setFrom(fromAddress);
        message.setTo(usuario.getEmailUsuario());
        message.setSubject("Redefinição de senha | CEI Jardim Rosa Maria");
        message.setText("Recebemos uma solicitação para redefinir sua senha. Acesse o link abaixo em até 30 minutos:\n\n"
                + link + "\n\nSe você não solicitou a alteração, ignore este e-mail.");
        mailSender.send(message);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível processar o token de redefinição.", exception);
        }
    }
}
