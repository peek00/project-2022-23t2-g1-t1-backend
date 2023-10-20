package com.ITSABackend.User.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DynamoDBConfig {
    DynamoDB dynamoDB = null;

    public DynamoDB getDynamoDB(){
        if (dynamoDB == null){
            synchronized(this){
                if(dynamoDB==null){
                    AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                                            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("http://host.docker.internal:8000", "us-west-2")) // Choose the appropriate region
                                            .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials("dummyAccessKeyId", "dummySecretAccessKey")))
                                            .build();
                                            
                    dynamoDB = new DynamoDB(client);
                }
            }
        }
        return dynamoDB;
    }

    
}
