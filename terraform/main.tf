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

resource "aws_key_pair" "deploy_key" {
  key_name   = "digitrans-deploy-key-v2"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDoSR+Hhi9mRLZUY9yOJGoCLnaxZ79URPhH15S7QfEC0lFKWOfW+RX7BvzOFIVhlLhvk5pTbnKoPNQH02rwrdC8LnP85s1HR1U8QZ0UWmSgeatmG0YOVMwp7oBshcSy2v+2iild/RLkE72Alc5VqfJ02bOr09nznTBt4Cff/X8iahg05+S2hNZAkw6alXKW11lhp0FuPJ63/cDx9TkH8cMFNA7EMg01jxt09OhSABsbf1XR6UoFSLl6P/55DkKkbAjbjIJ6epgucZnYpt5MzQ8HtjLC4E2kw4yT0R3uzZ4QAAjd+lLTyFuHN8yFwAp0GZfz5RXYNFCb1KSwzV3AfJRFrfZdyUU3LnWpRuTlljRF/h9SMY2SIUqzb5p0syqcsQGxawMsbPDFVHcEOtp6Gr3lmaNt69GDqVrErmGhs6ULwvJpDeyAbYi+aZ0fOK700xokBHfdLZNc+6DDhmIVSA2DYCsiRLX1xhY19x3n/wr5oxI48dLM1wksK0FKu/hz5GgaQb7Yzn6aYnefU0PufaxlR3AN6JOqp5gubK37JCTBn4hQ9yQ0Oij4bVdTu66kXm6mh/neHe8I/sS8xyrCZLKhr7nD8tTf0bTwurdzUdelJAmHVrmnItGCgMBlIkhlgB3OqEwUK3FQTJni0/k9455sJTVV/OVhh9Svy/BKBthccQ== USER@WILFRIED"
}

data "aws_security_group" "existing_sg" {
  name = "digitrans-supply-chain-sg"
}

resource "aws_instance" "digitrans_ec2" {
  ami           = "ami-053b0d53c279acc90"
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deploy_key.key_name

  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  tags = {
    Name = "digitrans-supply-chain-server"
  }
}

output "server_public_ip" {
  value       = aws_instance.digitrans_ec2.public_ip
  description = "L'adresse IP publique du serveur de production"
}
