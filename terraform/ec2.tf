resource "aws_launch_template" "ecs_lt" {
 name_prefix   = "ecs-template"
 image_id      = "ami-06018068a18569ff2"
 instance_type = "t3.micro"

 key_name               = "terraform"
 vpc_security_group_ids = [aws_security_group.security_group.id]
 iam_instance_profile {
   name = "terraform_ecs_ecs_role"
 }

 block_device_mappings {
   device_name = "/dev/xvda"
   ebs {
     volume_size = 30
     volume_type = "gp2"
   }
 }

 tag_specifications {
   resource_type = "instance"
   tags = {
     Name = "ecs-instance"
   }
 }

 user_data = filebase64("${path.module}/ecs.sh")
}