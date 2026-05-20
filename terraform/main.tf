provider "aws" {
  region = "us-east-1"
}

# 1. Groupe de sécurité pour ouvrir les ports nécessaires
resource "aws_security_group" "digitrans_sg" {
  name        = "digitrans-supply-sg"
  description = "Access pour la stack DIGITRANS-CM"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP Frontend"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API Backend"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "RabbitMQ Management"
    from_port   = 15672
    to_port     = 15672
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Instance EC2 (Ubuntu 22.04 LTS conseillé pour Docker/Ansible)
resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90" # AMI Ubuntu 22.04 LTS dans us-east-1
  instance_type = "t3.medium"             # Idéal pour faire tourner 5 conteneurs (Java + Node + PG + MQ)
  key_name      = "digitrans-key"         # Nom de ta paire de clés existante sur ton AWS

  vpc_security_group_ids = [aws_security_group.digitrans_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

# 3. Output pour récupérer automatiquement l'IP du serveur
output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
