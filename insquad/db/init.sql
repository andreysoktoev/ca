select 'create database insquad'
where not exists (select from pg_database where datname = 'insquad')
\gexec
\c insquad postgres

drop table if exists
  users,
  books
cascade;

create table users (
  "id" serial,
  "firstName" text,
  "lastName" text,
  "age" smallint,
  "isFree" boolean,
  "createdAt" date default now(),
  "updatedAt" date default now(),
  unique ("firstName", "lastName")
);