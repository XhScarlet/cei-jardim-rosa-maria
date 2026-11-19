SET @schema_name = DATABASE();

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = @schema_name AND table_name = 'tb_viewer' AND column_name = 'pagina_viewer') = 0,
    'ALTER TABLE tb_viewer ADD COLUMN pagina_viewer VARCHAR(100) NULL',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = @schema_name AND table_name = 'tb_viewer' AND column_name = 'data_viewer') = 0,
    'ALTER TABLE tb_viewer ADD COLUMN data_viewer DATETIME NULL',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = @schema_name AND table_name = 'tb_viewer' AND column_name = 'id_post_viewer') = 0,
    'ALTER TABLE tb_viewer ADD COLUMN id_post_viewer INT NULL',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

UPDATE tb_viewer
SET data_viewer = dt_acesso_viewer
WHERE data_viewer IS NULL;

UPDATE tb_viewer
SET pagina_viewer = 'Blog'
WHERE pagina_viewer IS NULL;

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.statistics
     WHERE table_schema = @schema_name AND table_name = 'tb_viewer' AND index_name = 'idx_tb_viewer_data_pagina') = 0,
    'CREATE INDEX idx_tb_viewer_data_pagina ON tb_viewer (data_viewer, pagina_viewer)',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.statistics
     WHERE table_schema = @schema_name AND table_name = 'tb_viewer' AND index_name = 'idx_tb_viewer_post') = 0,
    'CREATE INDEX idx_tb_viewer_post ON tb_viewer (id_post_viewer)',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

ALTER TABLE tb_viewer
    MODIFY COLUMN pagina_viewer VARCHAR(100) NOT NULL,
    MODIFY COLUMN data_viewer DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- A tabela original exigia um post em todo acesso; agora a visita a qualquer página é registrada.
ALTER TABLE tb_viewer
    MODIFY COLUMN tb_post_id_post INT UNSIGNED NULL;

-- Horário/local são opcionais para preservar registros antigos da agenda.
SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = @schema_name AND table_name = 'tb_agenda' AND column_name = 'hora_agenda') = 0,
    'ALTER TABLE tb_agenda ADD COLUMN hora_agenda TIME NULL',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;

SET @ddl = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = @schema_name AND table_name = 'tb_agenda' AND column_name = 'local_agenda') = 0,
    'ALTER TABLE tb_agenda ADD COLUMN local_agenda VARCHAR(100) NULL',
    'SELECT 1'
);
PREPARE dashboard_stmt FROM @ddl;
EXECUTE dashboard_stmt;
DEALLOCATE PREPARE dashboard_stmt;
