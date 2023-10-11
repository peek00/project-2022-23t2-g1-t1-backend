package com.ITSABackend.User.config;

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
                                            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration( "http://localhost:8000", "us-east-1"))
                                            .build();
                    dynamoDB = new DynamoDB(client);
                }
            }
        }
        return dynamoDB;
    }

    
}
