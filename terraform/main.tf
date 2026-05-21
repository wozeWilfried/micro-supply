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

# 1. Keypair géré par Terraform
resource "aws_key_pair" "deploy_key" {
  key_name   = "github-actions-deploy-key"
  public_key = file("${path.module}/../deploy_key.pub")
}

# 2. Récupération du Groupe de Sécurité existant
data "aws_security_group" "existing_sg" {
  name = "digitrans-supply-chain-sg"
}

# 3. Instance EC2
resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deploy_key.key_name

  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

# 4. Output IP
output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
