#!/bin/sh
sudo aptitude update
sudo aptitude upgrade -y
sudo aptitude install gcc make git-core nginx postgresql memcached python-dev python-setuptools supervisor postgresql-server-dev-all libxml2-dev libxslt-dev redis-server rabbitmq-server -y
sudo easy_install pip
sudo pip install virtualenv mercurial
cd /vagrant
virtualenv env --distribute
source env/bin/activate
pip install -r requirements
echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
echo -e "Host bitbucket.org\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
sudo su postgres << 'EOF'
psql -c "CREATE USER lisbonstartups WITH ENCRYPTED PASSWORD 'development';"
psql -c "CREATE DATABASE lisbonstartups WITH OWNER lisbonstartups ENCODING='UTF-8';"
EOF
python manage.py syncdb --noinput
python manage.py migrate --all

