package com.ITSABackend.User.service;

import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;

    // private final DynamoDbTable<User> userTable;

    public void createTable(String tableName) throws Exception{
        if (dynamoDBRepo.getTable(tableName) != null){
            dynamoDBRepo.createUserTable();
        }
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public void createUser(User user) throws Exception{
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
                .with("role", user.getRole()));

            System.out.println("Creat user success\n" + outcome.getPutItemResult());

        } catch(Exception e){
            System.out.println(" Only error");
            System.out.println(e.getMessage());

        }

    }

    public User getUserById(String id){
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);

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
                    user.setRole(outcome.getString("role"));
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

    public void updateUser(User user){
        System.out.println("Trying....");
        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
        .withPrimaryKey("id", user.getUserId())
        .withUpdateExpression("set firstName = :firstName, lastName = :lastName, email = :email, role = :role")
        .withValueMap(new ValueMap()
                .withString(":firstName", user.getfirstName())
                .withString(":lastName", user.getlastName())
                .withString(":email", user.getEmail())
                .withString(":role", user.getRole()))
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

}

