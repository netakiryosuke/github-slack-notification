# github-slack-notification

```bash
npm run build

cp package.json dist/package.json

cd infra/

terraform init -reconfigure -backend-config=./envs/${env_name}/config.s3.tfbackend

terraform plan -var-file=./envs/${env_name}/terraform.tfvars

terraform apply -var-file=./envs/${env_name}/terraform.tfvars
```
