# Terraform 

### Current State

All the Terraform files are copied from these two links below and have not been configured for our project.

[Link 1](https://spacelift.io/blog/terraform-ecs) | 
[Link 2](https://spacelift.io/blog/terraform-aws-provider)

## Terraform Installation

You will need to have the following installed in order to use Terraform. 

[Terraform Installation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

[AWS CLI](https://aws.amazon.com/cli/)

## AWS Configure

After installing the AWS CLI, you will need to configure it with your AWS credentials.
There is a Terraform user created already, **ping Xun for it if needed!**
```
aws configure
```

## Terraform Commands

Main commands to take note of are:
```
terraform init 
terraform plan
terraform apply
terraform destroy
```

Always remember to run `terraformd destroy` at the end of each session to tear down!
