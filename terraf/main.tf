terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ============================================================
# EXISTING VPC
# ============================================================

data "aws_vpc" "cloudnotes_vpc" {
  id = "vpc-04fdee8e108d118e9"
}

# ============================================================
# EXISTING SUBNET
# ============================================================

data "aws_subnet" "cloudnotes_subnet" {
  id = "subnet-05f46b8cc5f5b9c8c"
}

# ============================================================
# EXISTING SECURITY GROUP
# ============================================================

data "aws_security_group" "cloudnotes_sg" {
  id = "sg-09db7c19f8410116d"
}

# ============================================================
# EXISTING EC2 INSTANCE
# ============================================================

resource "aws_instance" "cloudnotes_server" {
  ami           = "ami-0aba19e56f3eaec05"
  instance_type = "t3.small"

  key_name = "cloudnotespro"

  subnet_id = data.aws_subnet.cloudnotes_subnet.id

  vpc_security_group_ids = [
    data.aws_security_group.cloudnotes_sg.id
  ]

  associate_public_ip_address = true

  tags = {
    Name = "cloudnotes-pro"
  }
}