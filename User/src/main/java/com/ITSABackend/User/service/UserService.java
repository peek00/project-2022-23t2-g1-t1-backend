package com.ITSABackend.User.service;

import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.BatchGetItemOutcome;
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
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.BatchGetItemRequest;
import com.amazonaws.services.dynamodbv2.model.KeysAndAttributes;
import com.amazonaws.services.dynamodbv2.model.LimitExceededException;
import com.amazonaws.services.dynamodbv2.model.QueryRequest;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import software.amazon.awssdk.utils.ImmutableMap;


@Service
public class UserService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createUserTable(false);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public String createUser(User user) throws Exception{
        // createTable(AppConstant.USER);
        Table table = dynamoDBRepo.getTable(AppConstant.USER);

        try{
            String id = UUID.randomUUID().toString();

            // System.out.println(id);
            // System.out.println(user.getfirstName());
            // System.out.println(user.getlastName());
            // System.out.println(user.getEmail());
            // System.out.println(user.getRoles());

            

            PutItemOutcome outcome = table.putItem(new Item().withPrimaryKey("userID", id)
                .with("firstName", user.getfirstName())
                .with("lastName", user.getlastName())
                .with("email", user.getEmail())
                .with("userRole", user.getRoles()));

            System.out.println("Create user success\n" + outcome.getPutItemResult());
            return id;

        } catch(Exception e){
            System.out.println("Create user failed");
            System.out.println(e.getStackTrace());
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create user");

        }

    }

    public User getUserById( String userId) throws LimitExceededException {
        User user = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        // System.out.println("Getting User from the DB");
        // System.out.println(userId);
    
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
                    // Set String array
                    user.setRole(outcome.getStringSet("userRole"));
                }
    
                return user;
    
            } catch (LimitExceededException e) {
                throw e;
            } catch (Exception e) {
                System.err.println("Unable to read user");
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
            // System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            // System.out.println("Item deleted successfully");
    
        } catch (Exception e) {
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
    }
    
    public void updateUser(User user, String userId) {
        // System.out.println("Trying....");
        // System.out.println(userId);
        // System.out.println(user.getfirstName());
        // System.out.println(user.getlastName());
        // System.out.println(user.getEmail());
        // System.out.println(user.getRoles());
        
        
    
        UpdateItemSpec updateItemSpec = new UpdateItemSpec()
                .withPrimaryKey("userID", userId)
                .withUpdateExpression("set firstName = :firstName, lastName = :lastName, email = :email, userRole = :userRole")
                .withValueMap(new ValueMap()
                        .withString(":firstName", user.getfirstName())
                        .withString(":lastName", user.getlastName())
                        .withString(":email", user.getEmail())
                        .withStringSet(":userRole", user.getRoles()))
                .withReturnValues(ReturnValue.UPDATED_NEW);
        
        try {
            Table table = dynamoDBRepo.getTable(AppConstant.USER);
            // System.out.println("Updating User...");
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
                // System.out.println("Reading user....");
                ItemCollection<QueryOutcome> items = emailIndex.query(spec);
                Item outcome = items.iterator().next();

                // System.out.println(outcome);

                if (outcome != null){
                    user = new User();
                    user.setUserId(outcome.getString("userID"));
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

    public User[] getUsersByIdList(List<String> userIdList){
        ArrayList<User> users = new ArrayList<User>();
        int count = 0;
        do{
            try {
                User user = getUserById(userIdList.get(count));
                users.add(user);
                count++;
            } catch (LimitExceededException e) {
                System.err.println("Retrying");
                System.err.println(e.getMessage());
                // Sleep
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e1) {
                    e1.printStackTrace();
                }
            } 
        }while(count < userIdList.size());
        return users.toArray(new User[users.size()]);
    }

    public User[] getAllUsers(Set<String> validRoleNames) {
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        ArrayList<User> users = new ArrayList<User>();
        ItemCollection<ScanOutcome> items;

        if (table != null){
            try{
                System.out.println("Reading user....");
                // if validRoleName is only of length 1, User, include a filter expression to not include the role name
                if (validRoleNames.size() == 1 && validRoleNames.contains("User")) {
                    String filterExpression = "contains (userRole, :roleName)";
                    ValueMap valueMap = new ValueMap().withString(":roleName", "User");
                    items = table.scan(filterExpression, "userID, companyID, firstName, lastName, email, userRole", null, valueMap);
                } else {
                    items = table.scan();
                }

                items.forEach(item -> {
                    // System.out.println(item);
                    User user = new User();
                    user.setUserId(item.getString("userID"));
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

    public Map<String, Object> getAllUsersPaged(Set<String> validRoleNames, String lastEvaluatedKey, String email) {
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        ArrayList<User> users = new ArrayList<>();
        ItemCollection<ScanOutcome> items = null;
        String newLastEvaluatedKey = null;
        Map<String, Object> result = new HashMap<>();
        ScanSpec spec = new ScanSpec();

        if (email.contains("@")) {
            ArrayList<User> userList = new ArrayList<>();
            User user = getUserByEmail(email);
            if (user != null) {
                userList.add(user);
            }
            result.put("users", userList.toArray(new User[userList.size()]));
            result.put("newLastEvaluatedKey", newLastEvaluatedKey);
            result.put("next", users.size() < 50);
            return result;
        }

        if (table != null) {
            try {
                // System.out.println("Reading user....");
                // If validRoleName is only of length 1, User, include a filter expression to not include the role name
                if (validRoleNames.size() == 1 && validRoleNames.contains("User")) {
                    String filterExpression = "contains (userRole, :roleName)";
                    ValueMap valueMap = new ValueMap().withString(":roleName", "user");
                    spec.withFilterExpression(filterExpression)
                        .withValueMap(valueMap);
                } 

                spec.withMaxResultSize(25); 
                if(lastEvaluatedKey.length() > 0){
                    spec.withExclusiveStartKey("userID", lastEvaluatedKey);
                }

                items = table.scan(spec);

                // System.out.println(items);

                items.forEach(item -> {
                    User user = new User();
                    user.setUserId(item.getString("userID"));
                    user.setEmail(item.getString("email"));
                    user.setfirstName(item.getString("firstName"));
                    user.setlastName(item.getString("lastName"));
                    user.setRole(item.getStringSet("userRole"));

                    users.add(user);
                });

                Map<String, AttributeValue> lastEvaluatedKeyMap = items.getLastLowLevelResult().getScanResult().getLastEvaluatedKey();
                


                if (lastEvaluatedKeyMap != null) {
                    newLastEvaluatedKey = lastEvaluatedKeyMap.get("userID").getS();
                }

            } catch (Exception e) {
                result.put("error", e.getMessage());
                System.err.println("Unable to read user");
                System.err.println(e.getMessage());
            }
        }
  
        result.put("users", users.toArray(new User[users.size()]));
        result.put("newLastEvaluatedKey", newLastEvaluatedKey);
        result.put("next", users.size() < 50);
        return result;
    }

    public List<String> getUserEmailsFromCompany(List<String> userIds){
        List<String> emails = new ArrayList<String>(); 
        try{
            
            Iterator<String> iterator = userIds.iterator();

            while (iterator.hasNext()) {
                User user = null;
                String str = iterator.next();
                user = this.getUserById(str);
                if (user != null){
                    emails.add(user.getEmail());
                }
            }
            return emails;
        }
        catch(Exception e){
            System.err.println("Unable to read emails");
            System.err.println(e.getMessage());
        }
        return emails;
        
    }

    public List<String> getUserEmailsFromCompanyByRole(List<String> userIds, String roleName){
        List<String> emails = new ArrayList<String>(); 
        try{
            
            Iterator<String> iterator = userIds.iterator();

            while (iterator.hasNext()) {
                User user = null;
                String str = iterator.next();
                user = this.getUserById(str);
                if (user != null && user.getRoles().contains(roleName)){
                    emails.add(user.getEmail());
                }
            }
            return emails;
        }
        catch(Exception e){
            System.err.println("Unable to read emails");
            System.err.println(e.getMessage());
        }
        return emails;
        
    }

    public List<String> getUsersByRole(ArrayList<String> roleNames) {
        Set<String> validRoleNames = new HashSet<>();
        validRoleNames.add("Owner");
        validRoleNames.add("Engineer");
        User[] usersArray = getAllUsers(validRoleNames);
        List<User> users = Arrays.asList(usersArray);

        // System.out.println(roleNames.get(0));
        // System.out.println(usersArray);
        // System.out.println(users.get(0).getEmail());

        // Filter users by roleName in userRole array
        List<String> filteredEmails = users.stream()
            .filter(user -> user.getRoles().stream().anyMatch(roleNames::contains))
            .map(User::getEmail)
            .collect(Collectors.toList());
    
        return filteredEmails;
        
    }

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

