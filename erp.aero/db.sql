select 'create database erp_aero'
where not exists (select from pg_database where datname = 'erp_aero')
\gexec
\c erp_aero postgres

drop table if exists users cascade;

create table users (
  id text unique not null,
  password text not null,
  access_token text,
  refresh_token text
);