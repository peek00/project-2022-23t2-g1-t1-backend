package com.ITSABackend.User.repo;


import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;
import com.ITSABackend.User.config.DynamoDBConfig;
import com.ITSABackend.User.constant.AppConstant;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DynamoDBRepo {
    @Autowired
    DynamoDBConfig dynamoDBConfig;

    public void createUserTable() throws Exception{
        try{
            System.out.println("Creating the table...");
            Table table = dynamoDBConfig.getDynamoDB().createTable(AppConstant.USER,
            Arrays.asList(
                new KeySchemaElement("bankId", KeyType.HASH),
                new KeySchemaElement("userId", KeyType.RANGE)
            ),
            Arrays.asList(
                new AttributeDefinition("bankId", ScalarAttributeType.S),
                new AttributeDefinition("userId", ScalarAttributeType.S),
                new AttributeDefinition("firstName", ScalarAttributeType.S),
                new AttributeDefinition("lastName", ScalarAttributeType.S),
                new AttributeDefinition("email", ScalarAttributeType.S),
                new AttributeDefinition("role", ScalarAttributeType.S)
            ),
            new ProvisionedThroughput(10L, 10L)
            
            );
            table.waitForActive();
            System.out.println("Table created Successfully. Status" 
                + table.getDescription().getTableStatus());

        } catch(Exception e ){
            System.err.println("Cannot create the table");
            throw new Exception("Error has occured");
        }
    }

    public Table getTable(String tableName){
        Table table = dynamoDBConfig.getDynamoDB().getTable(tableName);
        return table;
    }

    public void deleteTable(String tableName) throws Exception{
        Table table = dynamoDBConfig.getDynamoDB().getTable(tableName);
        try{
            System.out.println("Deleting Table...");
            table.delete();
            table.waitForDelete();
            System.out.println("Success");

        } catch(Exception e){
            System.err.println("Unable to delete table");
            System.err.println(e.getMessage());
            throw new Exception("Error has occured");
        }
    }
}
