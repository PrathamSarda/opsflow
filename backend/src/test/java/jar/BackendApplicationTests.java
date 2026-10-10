package jar;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void contextLoads() {
		assertTableExists("products");
		assertTableExists("users");
		assertTableExists("orders");
	}

	private void assertTableExists(String tableName) {
		Long tableCount = jdbcTemplate.queryForObject(
				"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC' AND TABLE_NAME = ?",
				Long.class,
				tableName.toUpperCase());
		org.junit.jupiter.api.Assertions.assertEquals(1L, tableCount, tableName + " table should be created");
	}

}
