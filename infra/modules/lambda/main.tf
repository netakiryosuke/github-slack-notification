data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = var.build_dir
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "main" {
  function_name = var.function_name

  role    = var.role_arn
  handler = "index.handler"
  runtime = "nodejs24.x"

  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  timeout     = 30
  memory_size = 128

  environment {
    variables = {
      GH_PAT            = var.github_pat
      SLACK_WEBHOOK_URL = var.slack_webhook_url
    }
  }
}
