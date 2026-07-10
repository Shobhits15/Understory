package com.understory.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        // Read from environment variables, with fallbacks to application.properties
        String jdbcUrl = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        
        // Fallback to defaults if env vars not set
        if (jdbcUrl == null) {
            jdbcUrl = "jdbc:mysql://mysql.railway.internal:3306/railway?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        }
        if (username == null) {
            username = "root";
        }
        if (password == null) {
            password = "shobhit15";
        }
        
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(10000);
        config.setIdleTimeout(600000);
        
        return new HikariDataSource(config);
    }
}

