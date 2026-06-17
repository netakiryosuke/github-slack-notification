resource "aws_scheduler_schedule" "main" {
  name = "github-notification"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = var.schedule_expression
  schedule_expression_timezone = "Asia/Tokyo"

  target {
    arn      = var.lambda_arn
    role_arn = var.role_arn
  }
}

resource "aws_lambda_permission" "scheduler" {
  statement_id  = "AllowScheduler"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.main.arn
}
