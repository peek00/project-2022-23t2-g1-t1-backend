package com.ITSABackend.User.repo;


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

import com.ITSABackend.User.config.DynamoDBConfig;
import com.ITSABackend.User.constant.AppConstant;

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.io.FileReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Map;

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

            // Key schema for table
            ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
            
            // tableKeySchema.add(new KeySchemaElement().withAttributeName("companyID").withKeyType(KeyType.HASH));// Partition KEY
            tableKeySchema.add(new KeySchemaElement().withAttributeName("userID").withKeyType(KeyType.HASH)); // Sort Key
            
            // Attribute definitions
            ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("userID").withAttributeType(ScalarAttributeType.S));
            // attributeDefinitions.add(new AttributeDefinition().withAttributeName("companyID").withAttributeType(ScalarAttributeType.S));
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("email").withAttributeType(ScalarAttributeType.S));
            
            
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

            if (!tableExists || (tableExists && restart)) {
                
                Table userTable = dynamoDBConfig.getDynamoDB().getTable(AppConstant.USER);

                // Define default items
                List<Item> defaultItems = new ArrayList<>();

                // Create a File object representing the working directory
                // File directory = new File(workingDir);
                // if (directory.isDirectory()) {
                //     // List files in the working directory
                //     File[] files = directory.listFiles();
                //     if (files != null) {
                //         System.out.println("Files in the working directory:");
                //         for (File file : files) {
                //             System.out.println(file.getName());
                //         }
                //     } else {
                //         System.out.println("No files found in the working directory.");
                //     }
                // } else {
                //     System.out.println("Invalid working directory path.");
                // }
                
                // try (Reader reader = new FileReader("/users.csv");
                //     CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT)) {

                //     for (CSVRecord csvRecord : csvParser) {
                //         String userID = csvRecord.get(0); 
                //         String email = csvRecord.get(1); 
                //         String firstName = csvRecord.get(2);
                //         String lastName = csvRecord.get(2);


                //         // Create a map of attribute values for the item
                //         defaultItems.add(new Item().withPrimaryKey("userID", userID)
                //                         .withString("email", email)
                //                         .withString("firstName", firstName)
                //                         .withString("lastName", lastName));

                //         // Create a PutItemRequest and put the item into the user table
                //     }
                try{
                   Set<String> roles = new HashSet<>(Arrays.asList("Owner", "Product Manager"));

                    defaultItems.add(new Item().withPrimaryKey("userID", "da7da4ff-f10c-4b89-ab64-ea7263f6b624")
                                        .withString("email", "waltraud_ondricka@oreilly.org")
                                        .withString("firstName", "Waltraud")
                                        .withString("lastName", "Ondricka")
                                        .withStringSet("userRole", roles)); // Use withStringSet to add a set of strings as an attribute

                    defaultItems.add(new Item().withPrimaryKey("userID",        "8c874087-9f1a-4c12-a4dc-4a4e53282b8e")
                                        .withString("email", "latricia_schulist@abbott.com")
                                        .withString("firstName", "Latricia")
                                        .withString("lastName", "Schulist")
                                        .withStringSet("userRole", roles));


                    defaultItems.add(new Item().withPrimaryKey("userID",        "8cecd1af-6c38-4186-9fe7-ba1cf15a7379")
                                        .withString("email", "russel.stephan@kihn.name")
                                        .withString("firstName", "Ruseel")
                                        .withString("lastName", "Stephan")
                                        .withStringSet("userRole", roles));

                    defaultItems.add(new Item().withPrimaryKey("userID",        "811082f02-d942-4ede-893c-0f75f36d4388")
                                        .withString("email", "ryan_schuster@oberbrunner-sauer.name")
                                        .withString("firstName", "Ryan")
                                        .withString("lastName", "Schuster")
                                        .withStringSet("userRole", roles));

                    defaultItems.add(new Item().withPrimaryKey("userID",        "718b5985-6df4-4367-aff0-edc1bd90d66e")
                                        .withString("email", "bobbie.mitchell@ward.org")
                                        .withString("firstName", "Bobbie")
                                        .withString("lastName", "Mitchell")
                                        .withStringSet("userRole", roles));

                    defaultItems.add(new Item().withPrimaryKey("userID",        "7e92ce5f-60d3-4224-b4b2-c9b29e73de16")
                                        .withString("email", "reatha_becker@simonis.info")
                                        .withString("firstName", "Reatha")
                                        .withString("lastName", "Becker")
                                        .withStringSet("userRole", roles));
                                        
                    
                    
                    System.out.println("Populating table " + AppConstant.USER + " with default values...");
                    TableWriteItems writeItems = new TableWriteItems(userTable.getTableName()).withItemsToPut(defaultItems);
                    BatchWriteItemOutcome outcome = dynamoDBConfig.getDynamoDB().batchWriteItem(writeItems);
                    System.out.println("Batch write successful: " + outcome.getBatchWriteItemResult());

                } catch (Exception e) {
                    System.err.println("Error occurred while populating user table from CSV file: " + e.getMessage());
                }

                
            } else {
                System.out.println("Table " + AppConstant.ROLE + " already exists, skipping population of default values.");
            }
            
        } catch (Exception e) {
            System.err.println("Cannot create the table");
            System.err.println(e.getMessage());
            throw new Exception("Error has occured");
        }
    }

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
                defaultItems.add(new Item().withPrimaryKey("roleName", "User"));
                defaultItems.add(new Item().withPrimaryKey("roleName", "Owner"));
                defaultItems.add(new Item().withPrimaryKey("roleName", "Manager"));
                defaultItems.add(new Item().withPrimaryKey("roleName", "Engineer"));
                defaultItems.add(new Item().withPrimaryKey("roleName", "Product Manager"));

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
    public void createCompanyTable(boolean restart) throws Exception {
        // Create a new role table with secondary index
        boolean tableExists = false;
        try {
            // get list of tables
            TableCollection<ListTablesResult> table = dynamoDBConfig.getDynamoDB().listTables();

            // Check if table already exists
            for (Table t : table) {
                if (t.getTableName().equals(AppConstant.COMPANY)) {
                    tableExists = true;
                    break;
                }
            }
            // Delete the table if it already exists
            if (tableExists && restart) {
                deleteTable(dynamoDBConfig.getDynamoDB().getTable(AppConstant.COMPANY).getTableName());
            }
            // Attribute definitions
            ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("companyID").withAttributeType(ScalarAttributeType.S));
            // Key schema for table
            ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
            tableKeySchema.add(new KeySchemaElement().withAttributeName("companyID").withKeyType(KeyType.HASH)); // Partition key

            CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(AppConstant.COMPANY)
                .withProvisionedThroughput(
                    new ProvisionedThroughput().withReadCapacityUnits((long) 1).withWriteCapacityUnits((long) 1))
                .withAttributeDefinitions(attributeDefinitions).withKeySchema(tableKeySchema);

            System.out.println("Creating table " + AppConstant.COMPANY + "...");
            dynamoDBConfig.getDynamoDB().createTable(createTableRequest);

            if (!tableExists || (tableExists && restart)) {
                
            Table companyTable = dynamoDBConfig.getDynamoDB().getTable(AppConstant.COMPANY);

            // Define default items
            List<Item> defaultItems = new ArrayList<>();
            defaultItems.add(new Item().withPrimaryKey("companyID", "DBS").withString("companyName", "DBS"));
            defaultItems.add(new Item().withPrimaryKey("companyID", "POSB").withString("companyName", "POSB"));
            defaultItems.add(new Item().withPrimaryKey("companyID", "BofA").withString("companyName", "Bank Of America"));


            // Batch write the default items to the table
            
            System.out.println("Populating table " + AppConstant.COMPANY + " with default values...");
            TableWriteItems writeItems = new TableWriteItems(companyTable.getTableName()).withItemsToPut(defaultItems);
            BatchWriteItemOutcome outcome = dynamoDBConfig.getDynamoDB().batchWriteItem(writeItems);
            System.out.println("Batch write successful: " + outcome.getBatchWriteItemResult());
            
            } else {
                System.out.println("Table " + AppConstant.COMPANY + " already exists, skipping population of default values.");
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
