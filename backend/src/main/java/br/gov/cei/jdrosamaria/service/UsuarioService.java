package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.LoginRequest;
import br.gov.cei.jdrosamaria.dto.LoginResponse;
import br.gov.cei.jdrosamaria.model.Usuario;
import br.gov.cei.jdrosamaria.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse autenticar(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getSenha() == null
                || request.getEmail().isBlank()) {
            return null;
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailUsuarioIgnoreCase(request.getEmail().trim());
        if (usuarioOpt.isPresent()) {
            Usuario user = usuarioOpt.get();

            if ("A".equalsIgnoreCase(user.getStatusUsuario())
                    && Objects.equals(user.getSenhaUsuario(), request.getSenha())) {
                String initials = gerarIniciais(user.getNomeUsuario());
                return  new LoginResponse(
                        user.getNomeUsuario(),
                        initials,
                        user.getTipoUsuario(),
                        user.getIdDirecao(),
                        user.getIdUsuario());
            }
        }
        return null;
    }

    private String gerarIniciais(String nome) {
        if (nome == null || nome.isBlank()) return "US";
        String[] partes = nome.trim().split("\\s+");
        if (partes.length >= 2) {
            return (partes[0].substring(0, 1) + partes[partes.length - 1].substring(0, 1)).toUpperCase();
        }
        return partes[0].substring(0, Math.min(2, partes[0].length())).toUpperCase();
    }
}