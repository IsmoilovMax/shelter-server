-- =============================================================================
-- App user ga public sxemasida obyekt yaratish (PostgreSQL 15+ ko'p muhitlarda kerak)
-- =============================================================================
-- psql da SUPERUSER bilan ulaning, keyin YOUR_APP_USER ni .env dagi user bilan almashtiring.
-- Masalan: myuser yoki connection stringdagi user nomi.
-- =============================================================================

-- ALTER ROLE "YOUR_APP_USER" WITH LOGIN;

GRANT USAGE ON SCHEMA public TO "YOUR_APP_USER";
GRANT CREATE ON SCHEMA public TO "YOUR_APP_USER";

-- DDL ni superuser manual-ddl.sql bilan yaratgandan keyin, app user faqat DML qilsin desangiz:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "YOUR_APP_USER";
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "YOUR_APP_USER";
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "YOUR_APP_USER";
