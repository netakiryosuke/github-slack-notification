variable "function_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "build_dir" {
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
