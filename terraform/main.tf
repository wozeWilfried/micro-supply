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

# 1. Récupération du Groupe de Sécurité existant sur AWS
data "aws_security_group" "existing_sg" {
  name = "digitrans-supply-chain-sg"
}

# 2. Déploiement de l'Instance EC2 de Production
resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90" # Ubuntu Server 22.04 LTS
  instance_type = "t3.medium"
  
  # Utilisation de la clé validée présente sur ton compte AWS
  key_name      = "agricam-keypair-dev" 

  # Association du groupe de sécurité récupéré via le bloc data
  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

# 3. Output pour extraire dynamiquement l'IP pour Ansible
output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}