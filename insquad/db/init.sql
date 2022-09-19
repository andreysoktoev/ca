select 'create database insquad'
where not exists (select from pg_database where datname = 'insquad')
\gexec
\c insquad postgres

drop table if exists
  users,
  books,
  readers
cascade;

create table users (
  "id" serial primary key,
  "firstName" text,
  "lastName" text,
  "age" smallint,
  "isFree" boolean,
  "createdAt" date default now(),
  "updatedAt" date default now(),
  unique ("firstName", "lastName")
);

create table books (
  "id" serial primary key,
  "title" text,
  "author" text,
  "createdAt" date default now(),
  unique (title, author)
);

create table readers (
  uid int references users on delete cascade,
  bid int references books on delete cascade,
  unique (uid, bid)
);

drop view if exists
  users_view
cascade;

create view users_view as
select
  "id",
  "firstName",
  "lastName",
  "age",
  "isFree",
  "createdAt",
  "updatedAt",
  "books"
from users u
left join (
  select uid, jsonb_agg(book) books from readers r
  left join (
    select id, jsonb_build_object('id', id, 'title', title, 'author', author) book from books
  ) b on b.id = r.bid
  group by uid
) b on b.uid = u.id;

insert into users ("firstName") values ('a'), ('b'), ('c');
insert into books ("title") values ('one'), ('two'), ('three');
insert into readers values
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 2),
  (3, 1);