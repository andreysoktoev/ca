select 'create database erp_aero'
where not exists (select from pg_database where datname = 'erp_aero')
\gexec
\c erp_aero postgres

drop table if exists
  files,
  users
cascade;

create table files (
  id serial,
  name text,
  extension text,
  mime text,
  size int,
  date timestamp
);

create table users (
  id text unique not null,
  password text not null,
  access_token text,
  refresh_token text
);