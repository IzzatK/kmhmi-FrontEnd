SET ENV_CONFIG=%1
SET SSH_PEM=%2
SET SSH_USER=%3


@REM perform a local build
@REM cd ../web
@REM npm run build:%ENV_CONFIG%

@REM navigate up to repo root
@REM cd ../ci


@REM set permissions
ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/"
@REM clear deployment directory
ssh -i %SSH_PEM% %SSH_USER% "sudo rm -r /km_deployment/*"
ssh -i %SSH_PEM% %SSH_USER% "sudo mkdir /km_deployment/ui/"
ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/ui/"
@REM copy deployment files
scp -i %SSH_PEM% -r ../ci/* %SSH_USER%:/km_deployment/
@REM copy ui files
@REM scp -i %SSH_PEM% -r ../web/build/* %SSH_USER%:/km_deployment/ui/

ssh -i %SSH_PEM% %SSH_USER% "chmod 777 /km_deployment/deploy-docker.%ENV_CONFIG%.sh"
ssh -i %SSH_PEM% %SSH_USER% "cd /km_deployment && ./deploy-docker.%ENV_CONFIG%.sh"


@REM @REM set permissions
@REM ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/"
@REM @REM clear deployment directory
@REM ssh -i %SSH_PEM% %SSH_USER% "sudo rm -r /km_deployment/*"
@REM @REM copy docker files
@REM scp -i %SSH_PEM% -r ./deploy-docker.%ENV_CONFIG%.sh %SSH_USER%:/km_deployment/
@REM scp -i %SSH_PEM% -r ./docker-compose.yml %SSH_USER%:/km_deployment/docker-compose.yml
@REM ssh -i %SSH_PEM% %SSH_USER% "mkdir /km_deployment/env/"
@REM scp -i %SSH_PEM% -r ./env/env.%ENV_CONFIG% %SSH_USER%:/km_deployment/env/env.%ENV_CONFIG%
@REM @REM  copy nginx files
@REM scp -i %SSH_PEM% -r ./nginx/ %SSH_USER%:/km_deployment/nginx/
@REM scp -i %SSH_PEM% -r ./certs/ %SSH_USER%:/km_deployment/certs/
@REM @REM copy ui files
@REM ssh -i %SSH_PEM% %SSH_USER% "sudo mkdir /km_deployment/ui/"
@REM @REM ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/ui/"
@REM @REM scp -i %SSH_PEM% -r ../web/build/* %SSH_USER%:/km_deployment/ui/
@REM
@REM ssh -i %SSH_PEM% %SSH_USER% "sudo chmod -R 755 /km_deployment/*"
@REM
@REM @REM ssh -i %SSH_PEM% %SSH_USER% "cd km_deployment; sudo ./deploy-docker.%ENV_CONFIG%.sh"