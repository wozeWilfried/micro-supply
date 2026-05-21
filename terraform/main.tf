terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_security_group" "existing_sg" {
  name = "digitrans-supply-chain-sg"
}

resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.micro"
  key_name      = "digitrans-deploy-key-v2"

  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
