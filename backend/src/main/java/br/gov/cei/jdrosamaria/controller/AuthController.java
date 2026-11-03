package br.gov.cei.jdrosamaria.controller;

import br.gov.cei.jdrosamaria.dto.LoginRequest;
import br.gov.cei.jdrosamaria.dto.LoginResponse;
import br.gov.cei.jdrosamaria.dto.PasswordResetRequest;
import br.gov.cei.jdrosamaria.service.PasswordResetService;
import br.gov.cei.jdrosamaria.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final SecurityContextRepository securityContextRepository;
    private final PasswordResetService passwordResetService;

    public AuthController(
            UsuarioService usuarioService,
            SecurityContextRepository securityContextRepository,
            PasswordResetService passwordResetService) {
        this.usuarioService = usuarioService;
        this.securityContextRepository = securityContextRepository;
        this.passwordResetService = passwordResetService;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of("token", csrfToken.getToken());
    }

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody(required = false) LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse servletResponse) {
        LoginResponse loginResponse = usuarioService.autenticar(loginRequest);

        if (loginResponse == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
        }

        if (request.getSession(false) != null) {
            request.changeSessionId();
        }

        String email = loginRequest.getEmail().trim();
        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                email,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, servletResponse);

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/session")
    public ResponseEntity<LoginResponse> session(Authentication authentication) {
        LoginResponse response = usuarioService.buscarSessao(authentication.getName());
        if (response == null) {
            SecurityContextHolder.clearContext();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.solicitar(request.getEmail());
        } catch (RuntimeException exception) {
            // Mantém a resposta genérica ao cliente e registra falhas de SMTP para diagnóstico local.
            logger.warn("Falha ao processar solicitação de recuperação de senha.", exception);
        }
        return ResponseEntity.ok(java.util.Map.of("message", "Se o e-mail estiver cadastrado, enviaremos um link de recuperação."));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody PasswordResetRequest request) {
        if (!passwordResetService.redefinir(request)) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Link inválido ou expirado. Solicite uma nova recuperação."));
        }
        return ResponseEntity.ok(java.util.Map.of("message", "Senha alterada com sucesso."));
    }
}
