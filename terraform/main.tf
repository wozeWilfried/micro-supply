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

# Clé SSH gérée automatiquement
resource "aws_key_pair" "digitrans_key" {
  key_name   = "digitrans-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDSlIxRYXX9J7+JZ1VSSBESwCvBrjDQmTRsBzaJ92B0XzrSrGetdxnr8bQyom5aOtTWo6s3vHeg7lhakAUszUu51IZNEKE2cIDoBGyBqW8rxpce8k+4XW5PHSP3PauzInukloHBvbNOJsf/IrkLDLVMKJsnA7XhT5SpH4yraV2T8O7+4YnIJnEhm/Z2UrzEzZ+22Oetulp0gFS5xRDzklZaNpLTmg74Rt1+4G7ULHN0jMTQMCu0O4nITNceD1S2vaQeqaQKaA5HnuI66xvbKuDN8GYclBTA2AkHOcoF1dmMsIEigLUBuC7ZHEmYBP9Ar9MzFr4rrUda9U8jBFaZiKwI2cxDYtsvd/o3ZmTFWb38tZDzHw8odWJdiVS15Sh6ppS58rvnsGaSNBHy56JTwbqSedgmbNXYw085UneDWpc3GTTzZnTth3CWbBzrN82abXKe3JITNEiRaKKu2hiLNOc+UjbyjNVEDzXGKjpCSuKOuiGo09JyLz9JexcQrP6Ucs545ioByRB/C/wQkEFH5uTDY4tMbcKzDK3/wbo1dwfk0VBgF1R8gmOgwAw8qxSrP6uI3yEYX6fGDK2bRziCp84rr2lS6m0qOB7LbF8eI32lYv0c99PdXrponfdJl6p04NNiURz6ycjH9F+pEjiJGc2i8Htm1fAvh/gYesXR08sffw== userwitsel@WILFRIED"
}

# Nouveau nom unique pour éviter la collision sur AWS
resource "aws_security_group" "digitrans_sg" {
  name        = "digitrans-supply-chain-sg"
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

resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.medium"
  key_name      = aws_key_pair.digitrans_key.key_name

  vpc_security_group_ids = [aws_security_group.digitrans_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
