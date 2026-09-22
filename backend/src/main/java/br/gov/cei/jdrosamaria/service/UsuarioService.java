package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.LoginRequest;
import br.gov.cei.jdrosamaria.dto.LoginResponse;
import br.gov.cei.jdrosamaria.model.Usuario;
import br.gov.cei.jdrosamaria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public LoginResponse autenticar(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailUsuarioAndSenhaUsuario(
                request.getEmail().trim().toLowerCase(),
                request.getSenha()
        );

        if (usuarioOpt.isPresent()) {
            Usuario user = usuarioOpt.get();

            // Verifica se o usuário está ativo (Status 'A')
            if ("A".equalsIgnoreCase(user.getStatusUsuario())) {
                String initials = gerarIniciais(user.getNomeUsuario());
                return new LoginResponse(user.getNomeUsuario(), initials, user.getTipoUsuario());
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