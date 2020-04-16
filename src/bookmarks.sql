-- First, remove the table if it exists
drop table if exists bookmarks;

-- Create the table anew
create table bookmarks (
  id INTEGER primary key generated by default as identity,
  title text not null,
  url_ varchar(100),
  desc_ text,
  rating INTEGER
);

-- insert some test data
-- Using a multi-row insert statement here
insert into bookmarks (title, url_, desc_, rating)
values
  ('Aoogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Boogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Coogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Doogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Eoogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Foogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Google', 'http://google.com', 'An indie search engine startup', '1'),
  ('Hoogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Ioogle', 'http://google.com', 'An indie search engine startup', '1'),
  ('Joogle', 'http://google.com', 'An indie search engine startup', '1');
    