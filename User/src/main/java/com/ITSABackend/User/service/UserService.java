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
import com.amazonaws.services.dynamodbv2.document.ScanFilter;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;


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
            String id = UUID.randomUUID().toString();
            System.out.println("Hi");
            System.out.println(id);
            System.out.println(user.getfirstName());
            System.out.println(user.getlastName());
            System.out.println(user.getEmail());
            System.out.println(user.getRoles());
            System.out.println(user.getCompanyIDs());
            System.out.println(user.getCompanyName());
            

            PutItemOutcome outcome = table.putItem(new Item().withPrimaryKey("userID", id)
                .with("firstName", user.getfirstName())
                .with("lastName", user.getlastName())
                .with("email", user.getEmail())
                .with("userRole", user.getRoles())
                .with("companyIDs", user.getCompanyIDs())
                .with("companyName", user.getCompanyName()));

            System.out.println("Create user success\n" + outcome.getPutItemResult());
            return id;

        } catch(Exception e){
            System.out.println("Only error");
            System.out.println(e.getStackTrace());
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create user");

        }

    }

    public User getUserById( String userId) {
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        System.out.println("Getting User from the DB");
        System.out.println(userId);
    
        if (table != null) {
            GetItemSpec spec = new GetItemSpec()
                    .withPrimaryKey("userID", userId);
    
            try {
                System.out.println("Reading user....");
                Item outcome = table.getItem(spec);
                System.out.println(outcome);
    
                if (outcome != null) {
                    user = new User();
                    user.setUserId(outcome.getString("userID"));
                    user.setEmail(outcome.getString("email"));
                    user.setfirstName(outcome.getString("firstName"));
                    user.setlastName(outcome.getString("lastName"));
                    user.setCompanyIDs(outcome.getStringSet("companyIDs"));
                    // Set String array
                    user.setRole(outcome.getStringSet("userRole"));
                    user.setCompanyName(outcome.getString("companyName"));
                }
    
                return user;
    
            } catch (Exception e) {
                System.err.println("Unable to read user" + userId);
                System.err.println(e.getMessage());
            }
        }
        return user;
    }
    

    public void deleteUser(String userId) {
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
                .withPrimaryKey("userID", userId);
    
        try {
            Table table = dynamoDBRepo.getTable(AppConstant.USER);
            System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            System.out.println("Item deleted successfully");
    
        } catch (Exception e) {
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
    }
    

    public void updateUser(User user, String userId) {
        System.out.println("Trying....");
        System.out.println(user.getCompanyIDs());
        System.out.println(userId);
        System.out.println(user.getfirstName());
        System.out.println(user.getlastName());
        System.out.println(user.getEmail());
        System.out.println(user.getRoles());
        
        
    
        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
                .withPrimaryKey("userID", userId)
                .withUpdateExpression("set firstName = :firstName, lastName = :lastName, email = :email, userRole = :userRole, companyIDs = :companyIDs")
                .withValueMap(new ValueMap()
                        .withStringSet(":companyIDs", user.getCompanyIDs())
                        .withString(":firstName", user.getfirstName())
                        .withString(":lastName", user.getlastName())
                        .withString(":email", user.getEmail())
                        .withStringSet(":userRole", user.getRoles()))
                .withReturnValues(ReturnValue.UPDATED_NEW);
        
        System.out.println("Update item spec created");
    
        try {
            Table table = dynamoDBRepo.getTable(AppConstant.USER);
            System.out.println("Updating User...");
            UpdateItemOutcome outcome = table.updateItem(updateItemSpec);
            System.out.println("Update user successful " + outcome.getItem().toJSONPretty());
        } catch (Exception e) {
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
                    user.setUserId(outcome.getString("userID"));
                    user.setEmail(outcome.getString("email"));
                    user.setfirstName(outcome.getString("firstName"));
                    user.setlastName(outcome.getString("lastName"));
                    user.setRole(outcome.getStringSet("userRole"));
                    user.setCompanyIDs(outcome.getStringSet("companyID"));
                    user.setCompanyName(outcome.getString("companyName"));
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
                ItemCollection<ScanOutcome> items = table.scan(filterExpression, "userID, companyID, firstName, lastName, email, userRole", null, valueMap);
                items.forEach(item -> {
                    System.out.println(item);
                    User user = new User();
                    user.setUserId(item.getString("userID"));
                    user.setEmail(item.getString("email"));
                    user.setfirstName(item.getString("firstName"));
                    user.setlastName(item.getString("lastName"));
                    user.setRole(item.getStringSet("userRole"));
                    user.setCompanyIDs(item.getStringSet("companyID"));
                    user.setCompanyName(item.getString("companyName"));
                    users.add(user);
                });

            } catch(Exception e){
                System.err.println("Unable to read user");
                System.err.println(e.getMessage());
            }
        }
        return users.toArray(new User[users.size()]);
    }

    // public List<User> getUsersByCompany(String companyId) {
    //     List<User> users = new ArrayList<>();

    //     Table table = dynamoDBRepo.getTable(AppConstant.USER);
    //     System.out.println("Getting Users from the DB by Company");

    //     if (table != null) {
    //         ScanFilter filter = new ScanFilter("companyID").eq(companyId);
            
    //         try {
    //             ItemCollection<ScanOutcome> items = table.scan(filter);
    //             for (Item item : items) {
    //                 User user = new User();
    //                 user.setUserId(item.getString("userID"));
    //                 user.setEmail(item.getString("email"));
    //                 user.setfirstName(item.getString("firstName"));
    //                 user.setlastName(item.getString("lastName"));
    //                 user.setCompanyIDs(item.getStringSet("companyID"));
    //                 user.setRole(item.getStringSet("userRole")); 
    //                 user.setCompanyName(item.getString("companyName"));

    //                 users.add(user);
    //             }
    //         } catch (Exception e) {
    //             System.err.println("Unable to fetch users by company");
    //             System.err.println(e.getMessage());

    //         }
    //     }

    //     return users;
    // }

    // public List<User> getUsersByRoleFromCompany(String companyID, String roleName) {
    //     List<User> users = getUsersByCompany(companyID);

    //     // Filter users by roleName in userRole array
    //     List<User> filteredUsers = users.stream()
    //             .filter(user -> user.getRoles().contains(roleName))
    //             .collect(Collectors.toList());

    //     return filteredUsers;
    // }

    // public List<String> getUserEmailsByUserIDsFromCompany(String companyID, List<String> userIDs) {
    //     List<User> users = getUsersByCompany(companyID);
    
    //     // Filter users by user IDs in the given array and extract emails
    //     List<String> emails = users.stream()
    //             .filter(user -> userIDs.contains(user.getUserId()))
    //             .map(User::getEmail)
    //             .collect(Collectors.toList());
    
    //     return emails;
    // }
}

