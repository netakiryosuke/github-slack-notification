# github-slack-notification

AWS Lambda + EventBridge を利用し、GitHub Notification を毎分チェックして Slack 通知するスクリプトです。

## ビルド＆デプロイ
```bash
npm run build

cp package.json dist/package.json

cd infra/

terraform init -reconfigure -backend-config=./envs/config.s3.tfbackend

terraform plan -var-file=./envs/terraform.tfvars

terraform apply -var-file=./envs/terraform.tfvars
```
