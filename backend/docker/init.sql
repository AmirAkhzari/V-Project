CREATE USER vproject_app WITH PASSWORD 'vproject_app' LOGIN NOSUPERUSER NOBYPASSRLS;
CREATE DATABASE vproject_test OWNER vproject;
GRANT CONNECT ON DATABASE vproject TO vproject_app;
GRANT CONNECT ON DATABASE vproject_test TO vproject_app;
