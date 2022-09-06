select 'create database outside_digital'
where not exists (select from pg_database where datname = 'outside_digital')
\gexec
\c outside_digital postgres

create extension if not exists pgcrypto;

drop table if exists
  users,
  tags
cascade;

create table users (
  uid uuid primary key default gen_random_uuid(),
  email varchar(100) not null,
  password text not null,
  nickname varchar(30) not null
);

create table tags (
  id serial,
  creator uuid unique not null references users on delete cascade on update cascade,
  name varchar(40) not null,
  sort_order int not null default 0
);