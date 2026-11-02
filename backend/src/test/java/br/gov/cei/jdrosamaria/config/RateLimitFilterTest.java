package br.gov.cei.jdrosamaria.config;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitFilterTest {

    @Test
    void limitaLoginAoQuintoEnvioPorIp() throws Exception {
        RateLimitFilter filter = new RateLimitFilter("http://localhost:5500");

        for (int attempt = 1; attempt <= 6; attempt++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr("127.0.0.1");
            MockHttpServletResponse response = new MockHttpServletResponse();
            FilterChain chain = (filteredRequest, filteredResponse) -> {};

            filter.doFilter(request, response, chain);

            assertThat(response.getStatus())
                    .as("tentativa %s", attempt)
                    .isEqualTo(attempt <= 5 ? 200 : 429);
        }
    }
}
