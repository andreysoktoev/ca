select 'create database outside_digital'
where not exists (select from pg_database where datname = 'outside_digital')
\gexec
\c outside_digital postgres

create extension if not exists pgcrypto;

drop table if exists
  users,
  tags,
  user_tags
cascade;

create table users (
  uid uuid primary key default gen_random_uuid(),
  email varchar(100) unique not null,
  password text not null,
  nickname varchar(30) unique not null
);

create table tags (
  id serial primary key,
  creator uuid not null references users on delete cascade on update cascade,
  name varchar(40) unique not null,
  sort_order int not null default 0
);

create table user_tags (
  uid uuid not null references users on delete cascade on update cascade,
  tid int not null references tags on delete cascade on update cascade
);

insert into users values
('f61749ac-6b18-41b5-8a03-35d9f0041da4', 'a@example.com', 'a', 'a'),
('f943ce72-e730-44ff-ab3a-f67d68b8e1cc', 'b@example.com', 'b', 'b'),
('0537137f-bb45-41bf-81e8-347900c11497', 'c@example.com', 'c', 'c');

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

insert into user_tags values
((select uid from users where nickname = 'a'), (select id from tags where name = 'one')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'two')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'three')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'four')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'five')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'six')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'seven')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'eight')),
((select uid from users where nickname = 'a'), (select id from tags where name = 'nine'));

drop view if exists
  tags_view,
  users_view
cascade;

create view tags_view as
select
  id,
  jsonb_build_object('nickname', nickname, 'uid', uid) creator,
  name,
  sort_order
from tags
left join users on uid = creator;

create view users_view as
select
  u.uid,
  email,
  nickname,
  tags
from users u
left join (
  select uid, jsonb_agg(tag) tags from user_tags ut
  left join (
    select id, jsonb_build_object('id', id, 'name', name, 'sort_order', sort_order) tag from tags
  ) t on t.id = ut.tid
  group by uid
) t on t.uid = u.uid;