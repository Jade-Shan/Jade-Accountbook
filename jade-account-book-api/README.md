Jade-account-book
=================

personal account book

create user app identified by '123';
create user dev identified by '123';

create database jadeaccountbook;
create database jadesport;

GRANT ALL PRIVILEGES ON jadeaccountbook.* TO 'dev'@'%';
GRANT ALL PRIVILEGES ON jadesport.* TO 'dev'@'%';

GRANT SELECT,INSERT,UPDATE,DELETE ON jadeaccountbook.* TO 'app'@'%';
GRANT SELECT,INSERT,UPDATE,DELETE ON jadesport.* TO 'app'@'%';


# test git 
