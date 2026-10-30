package br.gov.cei.jdrosamaria.service;

import br.gov.cei.jdrosamaria.dto.BlogDTO;
import br.gov.cei.jdrosamaria.model.Blog;
import br.gov.cei.jdrosamaria.repository.BlogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
public class BlogService {

    private final BlogRepository repository;
    private final ArmazenamentoService armazenamento;

    public BlogService(BlogRepository repository, ArmazenamentoService armazenamento) {
        this.repository = repository;
        this.armazenamento = armazenamento;
    }

    public BlogDTO criar(BlogDTO dto, MultipartFile imagem) throws IOException {
        Blog blog = new Blog();
        copiarCampos(dto, blog);

        if (imagem != null && !imagem.isEmpty()) {
            blog.setImagemBlog(armazenamento.salvar(imagem));
        }
        return toDTO(repository.save(blog));
    }

    public List<BlogDTO> listar(String status) {
        List<Blog> blogs = (status == null || status.isBlank())
                ? repository.findAllByOrderByDataBlogDesc()
                : repository.findByStatusBlogOrderByDataBlogDesc(status);
        return blogs.stream().map(this::toDTO).toList();
    }

    public BlogDTO buscar(Long id) {
        return toDTO(buscarEntidade(id));
    }

    public BlogDTO atualizar(Long id, BlogDTO dto, MultipartFile imagem) throws IOException {
        Blog blog = buscarEntidade(id);
        copiarCampos(dto, blog);

        // Só troca a imagem se uma nova foi enviada
        if (imagem != null && !imagem.isEmpty()) {
            String urlAntiga = blog.getImagemBlog();
            blog.setImagemBlog(armazenamento.salvar(imagem));
            armazenamento.deletar(urlAntiga);
        }
        return toDTO(repository.save(blog));
    }

    public void deletar(Long id) {
        Blog blog = buscarEntidade(id);
        armazenamento.deletar(blog.getImagemBlog());
        repository.delete(blog);
    }

    // ---------- auxiliares ----------

    private Blog buscarEntidade(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog não encontrado: " + id));
    }

    private void copiarCampos(BlogDTO dto, Blog blog) {
        blog.setIdUsuario(dto.getIdUsuario());
        blog.setTituloBlog(dto.getTituloBlog());
        blog.setResumoBlog(dto.getResumoBlog());
        blog.setCategoriaBlog(dto.getCategoriaBlog());
        blog.setConteudoBlog(dto.getConteudoBlog());
        blog.setDataBlog(dto.getDataBlog());
        blog.setStatusBlog(dto.getStatusBlog());
    }

    private BlogDTO toDTO(Blog blog) {
        BlogDTO dto = new BlogDTO();
        dto.setIdBlog(blog.getIdBlog());
        dto.setIdUsuario(blog.getIdUsuario());
        dto.setTituloBlog(blog.getTituloBlog());
        dto.setResumoBlog(blog.getResumoBlog());
        dto.setCategoriaBlog(blog.getCategoriaBlog());
        dto.setConteudoBlog(blog.getConteudoBlog());
        dto.setImagemBlog(blog.getImagemBlog());
        dto.setDataBlog(blog.getDataBlog());
        dto.setStatusBlog(blog.getStatusBlog());
        return dto;
    }
}