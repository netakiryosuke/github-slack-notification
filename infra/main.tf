module "lambda" {
  source = "./modules/lambda"

  build_dir = "${path.root}/../dist"

  function_name = "github-notification"

  role_arn = var.lambda_role_arn

  github_pat        = var.github_pat
  slack_webhook_url = var.slack_webhook_url
}

module "scheduler" {
  source = "./modules/scheduler"

  schedule_expression = var.schedule_expression
  lambda_arn = module.lambda.function_arn
  lambda_name = module.lambda.function_name
  role_arn   = var.scheduler_role_arn
}
