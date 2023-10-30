package com.ITSABackend.User.repo;


import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableCollection;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.GlobalSecondaryIndex;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ListTablesResult;
import com.amazonaws.services.dynamodbv2.model.Projection;
import com.amazonaws.services.dynamodbv2.model.ProjectionType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;

import com.ITSABackend.User.config.DynamoDBConfig;
import com.ITSABackend.User.constant.AppConstant;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DynamoDBRepo {
    @Autowired
    DynamoDBConfig dynamoDBConfig;

    public void createUserTable(boolean restart) throws Exception {
        // Create a new user table with secondary index
        boolean tableExists = false;
        try {
            // get list of tables
            TableCollection<ListTablesResult> table = dynamoDBConfig.getDynamoDB().listTables();

            // Check if table already exists
            for (Table t : table) {
                if (t.getTableName().equals(AppConstant.USER)) {
                    tableExists = true;
                    break;
                }
            }
            // Delete the table if it already exists
            if (tableExists && restart) {
                deleteTable(dynamoDBConfig.getDynamoDB().getTable(AppConstant.USER).getTableName());
            }
            // Attribute definitions
            ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("id").withAttributeType(ScalarAttributeType.S));
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("email").withAttributeType(ScalarAttributeType.S));
            // Key schema for table
            ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
            tableKeySchema.add(new KeySchemaElement().withAttributeName("id").withKeyType(KeyType.HASH)); // Partition key
            // Initial provisioned throughput settings for the indexes
            ProvisionedThroughput ptIndex = new ProvisionedThroughput().withReadCapacityUnits(1L).withWriteCapacityUnits(1L);

            // CreateDateIndex
            GlobalSecondaryIndex createEmailIndex = new GlobalSecondaryIndex().withIndexName("email-index")
                .withProvisionedThroughput(ptIndex)
                .withKeySchema(new KeySchemaElement().withAttributeName("email").withKeyType(KeyType.HASH))
                .withProjection(new Projection().withProjectionType(ProjectionType.ALL));

            CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(AppConstant.USER)
                .withProvisionedThroughput(
                    new ProvisionedThroughput().withReadCapacityUnits((long) 1).withWriteCapacityUnits((long) 1))
                .withAttributeDefinitions(attributeDefinitions).withKeySchema(tableKeySchema)
                .withGlobalSecondaryIndexes(createEmailIndex);

            System.out.println("Creating table " + AppConstant.USER + "...");
            dynamoDBConfig.getDynamoDB().createTable(createTableRequest);
            
        } catch (Exception e) {
            System.err.println("Cannot create the table");
            System.err.println(e.getMessage());
            throw new Exception("Error has occured");
        }
    }

    public void createRoleTable(boolean restart) throws Exception {
        // Create a new user table with secondary index
        boolean tableExists = false;
        try {
            // get list of tables
            TableCollection<ListTablesResult> table = dynamoDBConfig.getDynamoDB().listTables();

            // Check if table already exists
            for (Table t : table) {
                if (t.getTableName().equals(AppConstant.ROLE)) {
                    tableExists = true;
                    break;
                }
            }
            // Delete the table if it already exists
            if (tableExists && restart) {
                deleteTable(dynamoDBConfig.getDynamoDB().getTable(AppConstant.ROLE).getTableName());
            }
            // Attribute definitions
            ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("roleType").withAttributeType(ScalarAttributeType.S));
            // Key schema for table
            ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
            tableKeySchema.add(new KeySchemaElement().withAttributeName("roleType").withKeyType(KeyType.HASH)); // Partition key
            // Initial provisioned throughput settings for the indexes
            ProvisionedThroughput ptIndex = new ProvisionedThroughput().withReadCapacityUnits(1L).withWriteCapacityUnits(1L);

            // // CreateDateIndex
            // GlobalSecondaryIndex createEmailIndex = new GlobalSecondaryIndex().withIndexName("email-index")
            //     .withProvisionedThroughput(ptIndex)
            //     .withKeySchema(new KeySchemaElement().withAttributeName("email").withKeyType(KeyType.HASH))
            //     .withProjection(new Projection().withProjectionType(ProjectionType.ALL));

            CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(AppConstant.ROLE)
                .withProvisionedThroughput(
                    new ProvisionedThroughput().withReadCapacityUnits((long) 1).withWriteCapacityUnits((long) 1))
                .withAttributeDefinitions(attributeDefinitions).withKeySchema(tableKeySchema);

            System.out.println("Creating table " + AppConstant.ROLE + "...");
            dynamoDBConfig.getDynamoDB().createTable(createTableRequest);
            
        } catch (Exception e) {
            System.err.println("Cannot create the table");
            System.err.println(e.getMessage());
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
