package br.gov.cei.jdrosamaria.repository;
import java.util.List;
import br.gov.cei.jdrosamaria.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findAllByOrderByDataBlogDesc();
    List<Blog> findByStatusBlogOrderByDataBlogDesc(String statusBlog);
}