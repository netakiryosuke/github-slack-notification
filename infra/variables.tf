variable "lambda_role_arn" {
  type = string
}

variable "scheduler_role_arn" {
  type = string
}

variable "schedule_expression" {
  type = string
}

variable "github_pat" {
  type      = string
  sensitive = true
}

variable "slack_webhook_url" {
  type      = string
  sensitive = true
}
