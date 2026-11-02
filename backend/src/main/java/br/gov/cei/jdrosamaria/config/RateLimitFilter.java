package br.gov.cei.jdrosamaria.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_TRACKED_KEYS = 10_000;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final AtomicLong requestCount = new AtomicLong();
    private final String allowedOrigin;

    public RateLimitFilter(
            @Value("${app.cors.allowed-origin:http://localhost:5500}") String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod())
                || !("/api/auth/login".equals(request.getRequestURI())
                || "/api/matricula".equals(request.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        long now = System.currentTimeMillis();
        String path = request.getRequestURI();
        String ip = request.getRemoteAddr();
        int limit = "/api/auth/login".equals(path) ? 5 : 10;
        long duration = "/api/auth/login".equals(path)
                ? 15 * 60 * 1000L
                : 60 * 60 * 1000L;
        String key = path + ":" + (ip == null ? "unknown" : ip);

        if (!permit(key, now, limit, duration)) {
            String origin = request.getHeader("Origin");
            if (allowedOrigin.equals(origin)) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Access-Control-Allow-Credentials", "true");
                response.setHeader("Vary", "Origin");
            }
            response.setStatus(429);
            Window window = windows.get(key);
            long retryAfter = window == null
                    ? duration / 1000
                    : Math.max(1, (window.startedAt + window.duration - now + 999) / 1000);
            response.setHeader("Retry-After", Long.toString(retryAfter));
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\":\"Limite de tentativas excedido. Tente novamente mais tarde.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean permit(String key, long now, int limit, long duration) {
        if (requestCount.incrementAndGet() % 512 == 0) {
            windows.entrySet().removeIf(entry -> now - entry.getValue().startedAt >= entry.getValue().duration);
        }

        AtomicBoolean allowed = new AtomicBoolean();
        Window window = windows.compute(key, (ignored, current) -> {
            if (current == null || now - current.startedAt >= current.duration) {
                if (current == null && windows.size() >= MAX_TRACKED_KEYS) {
                    return null;
                }
                allowed.set(true);
                return new Window(now, duration, 1);
            }
            if (current.count < limit) {
                current.count++;
                allowed.set(true);
            }
            return current;
        });

        return window != null && allowed.get();
    }

    private static final class Window {
        private final long startedAt;
        private final long duration;
        private int count;

        private Window(long startedAt, long duration, int count) {
            this.startedAt = startedAt;
            this.duration = duration;
            this.count = count;
        }
    }
}
