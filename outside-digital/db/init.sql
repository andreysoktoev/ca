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
  email varchar(100) unique not null,
  password text not null,
  nickname varchar(30) unique not null
);

create table tags (
  id serial,
  creator uuid not null references users on delete cascade on update cascade,
  name varchar(40) unique not null,
  sort_order int not null default 0
);

insert into users (email, password, nickname) values
('a@example.com', 'a', 'a'),
('b@example.com', 'b', 'b'),
('c@example.com', 'c', 'c');

insert into tags (creator, name, sort_order) values
((select uid from users where nickname = 'a'), 'one', 9),
((select uid from users where nickname = 'a'), 'two', 8),
((select uid from users where nickname = 'a'), 'three', 7),
((select uid from users where nickname = 'b'), 'four', 6),
((select uid from users where nickname = 'b'), 'five', 5),
((select uid from users where nickname = 'b'), 'six', 4),
((select uid from users where nickname = 'c'), 'seven', 3),
((select uid from users where nickname = 'c'), 'eight', 2),
((select uid from users where nickname = 'c'), 'nine', 1);

drop view if exists
  tag_user,
  user_tag
cascade;

create view tag_user as
select
  id,
  jsonb_build_object('nickname', nickname, 'uid', uid) creator,
  name,
  sort_order
from tags
left join users on uid = creator;

create view user_tag as
select
  uid,
  email,
  nickname,
  tags
from users
left join (
  select
    creator,
    jsonb_agg(jsonb_build_object('id', id, 'name', name, 'sort_order', sort_order)) tags
  from tags
  group by creator
) t
on creator = uid;