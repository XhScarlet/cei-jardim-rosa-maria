package br.gov.cei.jdrosamaria.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ViewerRepository {

    private final JdbcTemplate jdbcTemplate;

    public ViewerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long contarEntre(LocalDateTime inicio, LocalDateTime fim) {
        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM tb_viewer WHERE data_viewer >= ? AND data_viewer < ?",
                Long.class,
                Timestamp.valueOf(inicio),
                Timestamp.valueOf(fim));
        return total == null ? 0 : total;
    }

    public List<ContagemDiaria> contarPorDia(LocalDateTime inicio, LocalDateTime fim) {
        return jdbcTemplate.query(
                """
                        SELECT DATE(data_viewer) AS dia, COUNT(*) AS total
                        FROM tb_viewer
                        WHERE data_viewer >= ? AND data_viewer < ?
                        GROUP BY DATE(data_viewer)
                        """,
                (result, rowNumber) -> new ContagemDiaria(
                        result.getDate("dia").toLocalDate(),
                        result.getLong("total")),
                Timestamp.valueOf(inicio),
                Timestamp.valueOf(fim));
    }

    public List<PaginaContagem> paginasMaisAcessadas(LocalDateTime inicio, LocalDateTime fim) {
        return jdbcTemplate.query(
                """
                        SELECT pagina_viewer AS pagina, COUNT(*) AS total
                        FROM tb_viewer
                        WHERE data_viewer >= ? AND data_viewer < ?
                          AND pagina_viewer <> 'Página sem identificação'
                        GROUP BY pagina_viewer
                        ORDER BY total DESC, pagina_viewer ASC
                        LIMIT 5
                        """,
                (result, rowNumber) -> new PaginaContagem(
                        result.getString("pagina"),
                        result.getLong("total")),
                Timestamp.valueOf(inicio),
                Timestamp.valueOf(fim));
    }

    public long contarVisualizacoesPost(Integer idPost) {
        Long total = jdbcTemplate.queryForObject(
                """
                        SELECT COUNT(*) FROM tb_viewer
                        WHERE id_post_viewer = ?
                           OR (id_post_viewer IS NULL AND tb_post_id_post = ?)
                        """,
                Long.class,
                idPost,
                idPost);
        return total == null ? 0 : total;
    }

    public List<ContagemPost> contarVisualizacoesPosts() {
        return jdbcTemplate.query(
                """
                        SELECT COALESCE(id_post_viewer, tb_post_id_post) AS id_post, COUNT(*) AS total
                        FROM tb_viewer
                        WHERE COALESCE(id_post_viewer, tb_post_id_post) IS NOT NULL
                        GROUP BY COALESCE(id_post_viewer, tb_post_id_post)
                        """,
                (result, rowNumber) -> new ContagemPost(
                        result.getInt("id_post"),
                        result.getLong("total")));
    }

    public void registrar(String pagina, Integer idPost) {
        jdbcTemplate.update(
                """
                        INSERT INTO tb_viewer (
                            tb_post_id_post, dt_acesso_viewer, tipo_usuario_viewer,
                            pagina_viewer, data_viewer, id_post_viewer
                        )
                        VALUES (?, CURRENT_TIMESTAMP, 'V', ?, CURRENT_TIMESTAMP, ?)
                        """,
                idPost,
                pagina,
                idPost);
    }

    public record ContagemDiaria(LocalDate dia, long total) {}

    public record PaginaContagem(String pagina, long total) {}

    public record ContagemPost(Integer idPost, long total) {}
}
