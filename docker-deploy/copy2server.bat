copy ../web/build/ ./build /s /e
scp -i .\bumed-web-srv.pem -r c:/Repos/km-hmi/docker-deploy ec2-user@18.253.190.212:/km_deployment/