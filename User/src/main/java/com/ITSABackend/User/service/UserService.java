package com.ITSABackend.User.service;

import java.util.UUID;



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
        createTable(AppConstant.USER);
        Table table = dynamoDBRepo.getTable(AppConstant.USER);

        try{
            String bankId = user.getbankId();
            String userId = UUID.randomUUID().toString();

            PutItemOutcome outcome = table.putItem(new Item().withPrimaryKey("bankId", bankId)
                .with("userId", userId)
                .with("firstName", user.getfirstName())
                .with("lastName", user.getlastName())
                .with("email", user.getEmail())
                .with("role", user.getRole()));

            System.out.println("Creat user success\n" + outcome.getPutItemResult());

        } catch(Exception e){
            System.out.println(e.getMessage());
        }

    }

    public User getUserById(String bankId, String userId){
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);

        if (table != null){
            GetItemSpec spec = new GetItemSpec().withPrimaryKey("bankId", bankId, "userId", userId);

            try{
                System.out.println("Reading user....");
                Item outcome = table.getItem(spec);

                if (outcome != null){
                    user = new User();
                    user.setBankId(outcome.getString("bankId"));
                    user.setUserId(outcome.getString("userId"));
                    user.setEmail(outcome.getString("email"));
                    user.setfirstName(outcome.getString("firstName"));
                    user.setlastName(outcome.getString("lastName"));
                    user.setRole(outcome.getString("role"));
                }

                System.out.println("User retrieved" + outcome);

            } catch(Exception e){
                System.err.println("Unable to read user" + bankId + userId);
                System.err.println(e.getMessage());
            }
        }
        return user;

    }

    public void deleteUser(String bankId, String userId){
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
            .withPrimaryKey(new PrimaryKey("bankId", bankId, "userId", userId));
        
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
        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
            .withPrimaryKey("bankId", user.getbankId(), "userId", user.getUserId())
            .withUpdateExpression("set firstName = :user.getfirstName()")
            .withValueMap(new ValueMap().withString("firstName", user.getfirstName()))
            .withUpdateExpression("set lastName = :user.getlastName()")
            .withValueMap(new ValueMap().withString("lastName", user.getlastName()))
            .withUpdateExpression("set email = :user.getEmail()")
            .withValueMap(new ValueMap().withString("email", user.getEmail()))
            .withUpdateExpression("set role = :user.getRole()")
            .withValueMap(new ValueMap().withString("role", user.getRole()))
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


    // public UserService(DynamoDbTable<User> userTable) {
    //     this.userTable = userTable;
    // }

    // public User createUser(User user) {
    //     PutItemEnhancedRequest<User> request = PutItemEnhancedRequest.builder(User.class)
    //             .item(user)
    //             .build();

    //     userTable.putItem(request);

    //     return user;
    // }

    // public User getUserById(String bankId, String userId) {
    //     GetItemEnhancedRequest getItemRequest = GetItemEnhancedRequest.builder()
    //             .key(Key.builder().partitionValue(userId).build())
    //             .build();

    //     return userTable.getItem(getItemRequest);
    // }

    // public User updateUser(String bankId, String userId, User updatedUser) {
    //     updatedUser.setUserId(userId);

    //     PutItemEnhancedRequest<User> request = PutItemEnhancedRequest.builder(User.class)
    //             .item(updatedUser)
    //             .build();

    //     userTable.putItem(request);

    //     return updatedUser;
    // }

    // public void deleteUser(String bankId, String userId) {
    //     DeleteItemEnhancedRequest request = DeleteItemEnhancedRequest.builder()
    //             .key(Key.builder().partitionValue(userId).build())
    //             .build();

    //     userTable.deleteItem(request);
}

