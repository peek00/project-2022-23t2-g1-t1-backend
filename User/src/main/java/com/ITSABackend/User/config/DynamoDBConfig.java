package com.ITSABackend.User.config;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;


@Configuration
@PropertySource("classpath:application.properties")
public class DynamoDBConfig {
    DynamoDB dynamoDB = null;

    @Value("${amazon.dynamodb.endpoint}")
    private String amazonDynamoDBEndpoint;

    @Value("${amazon.aws.accessKeyID}")
    private String amazonAWSAccessKeyID;

    @Value("${amazon.aws.secretKey}")
    private String amazonAWSSecretKey;

    @Value("${amazon.aws.region}")
    private String amazonAWSRegion;

    private AWSCredentialsProvider awsDynamoDBCredentials() {
        return new AWSStaticCredentialsProvider(new BasicAWSCredentials(amazonAWSAccessKeyID, amazonAWSSecretKey));
    };

    @Primary
    @Bean
    public DynamoDBMapperConfig dynamoDBMapperConfig() {
        return DynamoDBMapperConfig.DEFAULT;
    }

    @Primary
    @Bean
    public DynamoDBMapper dynamoDBMapper(AmazonDynamoDB amazonDynamoDB, DynamoDBMapperConfig config) {
        return new DynamoDBMapper(amazonDynamoDB, config);
    }

    @Bean
    public AmazonDynamoDB getAmazonDynamoDB() {
        return  AmazonDynamoDBClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(amazonDynamoDBEndpoint, amazonAWSRegion)) // Choose the appropriate region
                .withCredentials(awsDynamoDBCredentials())
                .build();
    }


    public DynamoDB getDynamoDB(){
        if (dynamoDB == null){
            synchronized(this){
                if(dynamoDB==null){
                    System.out.println("Creating DynamoDB instance"+amazonAWSAccessKeyID+amazonAWSSecretKey+amazonAWSRegion+amazonDynamoDBEndpoint);
                    AmazonDynamoDB client = this.getAmazonDynamoDB();    
                    dynamoDB = new DynamoDB(client);
                    
                }
            }
        }
        return dynamoDB;
    }

    
}
