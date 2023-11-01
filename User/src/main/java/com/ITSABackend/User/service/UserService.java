package com.ITSABackend.User.service;

import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.Index;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;


@Service
public class UserService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createUserTable(true);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public String createUser(User user) throws Exception{
        // createTable(AppConstant.USER);
        Table table = dynamoDBRepo.getTable(AppConstant.USER);

        try{
            // System.out.println("On try");
            // System.out.println(user.getUserId());
            // System.out.println(user.getfirstName());
            // System.out.println(user.getlastName());

            String id = UUID.randomUUID().toString();

            PutItemOutcome outcome = table.putItem(new Item().withPrimaryKey("id", id)
                .with("firstName", user.getfirstName())
                .with("lastName", user.getlastName())
                .with("email", user.getEmail())
                .with("userRole", user.getRoles()));

            System.out.println("Create user success\n" + outcome.getPutItemResult());
            return id;

        } catch(Exception e){
            System.out.println(" Only error");
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create user");

        }

    }

    public User getUserById(String id){
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        System.out.println("Getting User from the DB");

        if (table != null){
            GetItemSpec spec = new GetItemSpec().withPrimaryKey("id", id);

            try{
                System.out.println("Reading user....");
                Item outcome = table.getItem(spec);

                if (outcome != null){
                    user = new User();
                    user.setUserId(outcome.getString("id"));
                    user.setEmail(outcome.getString("email"));
                    user.setfirstName(outcome.getString("firstName"));
                    user.setlastName(outcome.getString("lastName"));
                    // Set String array
                    user.setRole(outcome.getStringSet("userRole"));
                }

                return user;

            } catch(Exception e){
                System.err.println("Unable to read user" + id);
                System.err.println(e.getMessage());
            }
        }
        return user;

    }

    public void deleteUser(String id){
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
            .withPrimaryKey(new PrimaryKey("id", id));
        
        try {

            Table table = dynamoDBRepo.getTable(AppConstant.USER);
            System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            System.out.println("Item deleted, Successful");

        } catch (Exception e){
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
        
    }

    public void updateUser(User user, String id){
        System.out.println("Trying....");

        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
        .withPrimaryKey("id", id)
        .withUpdateExpression("set firstName = :firstName, lastName = :lastName, email = :email, userRole = :userRole")
        .withValueMap(new ValueMap()
                .withString(":firstName", user.getfirstName())
                .withString(":lastName", user.getlastName())
                .withString(":email", user.getEmail())
                .withStringSet(":userRole", user.getRoles()))
        .withReturnValues(ReturnValue.UPDATED_NEW);


        try{

            Table table = dynamoDBRepo.getTable(AppConstant.USER);
            System.out.println("Updating User...");
            UpdateItemOutcome outcome = table.updateItem(updateItemSpec);
            System.out.println("Update user successful " + outcome.getItem().toJSONPretty());

        } catch (Exception e){

            System.err.println("Unable to update User");
            System.err.println(e.getMessage());

        }
    }

    public User getUserByEmail(String email){
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        Index emailIndex = table.getIndex("email-index");

        QuerySpec spec = new QuerySpec()
            .withKeyConditionExpression("email = :email")
            .withValueMap(new ValueMap().withString(":email", email));
            

        if (table != null){
            try{
                System.out.println("Reading user....");
                ItemCollection<QueryOutcome> items = emailIndex.query(spec);
                Item outcome = items.iterator().next();

                System.out.println(outcome);

                if (outcome != null){
                    user = new User();
                    user.setUserId(outcome.getString("id"));
                    user.setEmail(outcome.getString("email"));
                    user.setfirstName(outcome.getString("firstName"));
                    user.setlastName(outcome.getString("lastName"));
                    user.setRole(outcome.getStringSet("userRole"));
                }

                return user;

            } catch(Exception e){
                System.err.println("Unable to read user" + email);
                System.err.println(e.getMessage());
            }
        }
        return user;
    }

    public User[] getAllUsers(String role) {
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        ArrayList<User> users = new ArrayList<User>();

        if (table != null){

            try{
                System.out.println("Reading user....");
                // Create FilterExpression
                String filterExpression = "contains(userRole, :userRole)";
                ValueMap valueMap = new ValueMap().withString(":userRole", role);
                ItemCollection<ScanOutcome> items = table.scan(filterExpression, "id, firstName, lastName, email, userRole", null, valueMap);
                items.forEach(item -> {
                    System.out.println(item);
                    User user = new User();
                    user.setUserId(item.getString("id"));
                    user.setEmail(item.getString("email"));
                    user.setfirstName(item.getString("firstName"));
                    user.setlastName(item.getString("lastName"));
                    user.setRole(item.getStringSet("userRole"));
                    users.add(user);
                });

            } catch(Exception e){
                System.err.println("Unable to read user");
                System.err.println(e.getMessage());
            }
        }
        return users.toArray(new User[users.size()]);
    }
}

