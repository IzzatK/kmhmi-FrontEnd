@REM perform a local build
cd ../web
@REM npm run build

@REM navigate up to repo root
cd ..

@REM set permissions
ssh -i ./ci/ssh/bumed-web-srv.pem -o StrictHostKeyChecking=no ec2-user@18.253.190.212 "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/"
@REM clear deployment directory
ssh -i ./ci/ssh/bumed-web-srv.pem -o StrictHostKeyChecking=no ec2-user@18.253.190.212 "sudo rm -r /km_deployment/*"
ssh -i ./ci/ssh/bumed-web-srv.pem -o StrictHostKeyChecking=no ec2-user@18.253.190.212 "sudo mkdir /km_deployment/ui/"
ssh -i ./ci/ssh/bumed-web-srv.pem -o StrictHostKeyChecking=no ec2-user@18.253.190.212 "sudo setfacl -R -m u:ec2-user:rwx /km_deployment/ui/"
@REM copy deployment files
scp -i ./ci/ssh/bumed-web-srv.pem -r ./ci/* ec2-user@18.253.190.212:/km_deployment/
@REM copy ui files
scp -i ./ci/ssh/bumed-web-srv.pem -r ./web/build/* ec2-user@18.253.190.212:/km_deployment/ui/