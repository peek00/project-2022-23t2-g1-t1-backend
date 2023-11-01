package com.ITSABackend.Role.repo;


import com.amazonaws.services.dynamodbv2.document.BatchWriteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableCollection;
import com.amazonaws.services.dynamodbv2.document.TableWriteItems;
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

import com.ITSABackend.Role.config.DynamoDBConfig;
import com.ITSABackend.Role.constant.AppConstant;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DynamoDBRepo {
    @Autowired
    DynamoDBConfig dynamoDBConfig;
    public void createRoleTable(boolean restart) throws Exception {
        // Create a new role table with secondary index
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
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("roleName").withAttributeType(ScalarAttributeType.S));
            // Key schema for table
            ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
            tableKeySchema.add(new KeySchemaElement().withAttributeName("roleName").withKeyType(KeyType.HASH)); // Partition key
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

            if (!tableExists || (tableExists && restart)) {
                
            Table roleTable = dynamoDBConfig.getDynamoDB().getTable(AppConstant.ROLE);

            // Define default items
            List<Item> defaultItems = new ArrayList<>();
            defaultItems.add(new Item().withPrimaryKey("roleName", "Owner"));
            defaultItems.add(new Item().withPrimaryKey("roleType", "Manager"));
            defaultItems.add(new Item().withPrimaryKey("roleType", "Engineer"));
            defaultItems.add(new Item().withPrimaryKey("roleType", "Product Manager"));

            // Batch write the default items to the table
            
            System.out.println("Populating table " + AppConstant.ROLE + " with default values...");
            TableWriteItems writeItems = new TableWriteItems(roleTable.getTableName()).withItemsToPut(defaultItems);
            BatchWriteItemOutcome outcome = dynamoDBConfig.getDynamoDB().batchWriteItem(writeItems);
            System.out.println("Batch write successful: " + outcome.getBatchWriteItemResult());
            
            } else {
                System.out.println("Table " + AppConstant.ROLE + " already exists, skipping population of default values.");
            }
            
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
