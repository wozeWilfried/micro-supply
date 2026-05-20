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

# On récupère le groupe de sécurité qui existe déjà sur ton compte AWS
data "aws_security_group" "existing_sg" {
  name = "digitrans-supply-chain-sg"
}

# Déploiement de l'instance EC2
resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.medium"
  key_name      = "digitrans-key" # Utilise la clé déjà présente sur AWS

  # On associe l'ID du groupe de sécurité récupéré ci-dessus
  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
