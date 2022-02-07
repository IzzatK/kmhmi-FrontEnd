@REM perform a local build
@REM cd ../web
@REM npm run build

@REM navigate up to repo root
@REM cd ..

SET SSH_PEM=%1
SET SSH_USER=%2

@REM set permissions
ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/"
@REM clear deployment directory
ssh -i %SSH_PEM% %SSH_USER% "sudo rm -r /km_deployment/*"
ssh -i %SSH_PEM% %SSH_USER% "sudo mkdir /km_deployment/ui/"
ssh -i %SSH_PEM% %SSH_USER% "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/ui/"
@REM copy deployment files
scp -i %SSH_PEM% -r ./ci/* %SSH_USER%:/km_deployment/
@REM copy ui files
@REM scp -i %SSH_PEM% -r ./web/build/* %SSH_USER%:/km_deployment/ui/