@REM docker-compose -p tbe up -d --force-recreate --remove-orphans

docker-compose -f docker-compose-test.yml -f docker-compose-production.yml up -d --force-recreate --remove-orphans
