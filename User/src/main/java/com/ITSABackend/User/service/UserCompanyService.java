package com.ITSABackend.User.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.Company;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.models.UserCompany;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

import jakarta.annotation.PostConstruct;

@Service
public class UserCompanyService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createUserCompanyTable(true);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public Map<String,Object> createPair(UserCompany pair) throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.USERCOMPANY);
        Map<String, Object> response = new HashMap<>();
        

        try{
            PutItemOutcome outcome = table.putItem(new Item()
                                    .withPrimaryKey("companyID", pair.getCompanyID())
                                    .with("userID", pair.getUserID()));
            System.out.println("Create company success\n" + outcome.getPutItemResult());
            response.put("companyID", pair.getCompanyID());
            response.put("userID", pair.getUserID());

            return response;

        } catch(Exception e){
            System.out.println(" Only error");
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create Company");
        }

    }

    public void deletePair(String companyID, String userID){
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
            .withPrimaryKey(new PrimaryKey("companyID", companyID, "userID", userID));
        
        try {

            Table table = dynamoDBRepo.getTable(AppConstant.USERCOMPANY);
            System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            System.out.println("Item deleted, Successful");

        } catch (Exception e){
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
        
    }
    
    public List<UserCompany> getPairsByCompanyID(String companyID) {
        List<UserCompany> pairs = new ArrayList<>();

        Table table = dynamoDBRepo.getTable(AppConstant.USERCOMPANY);
        System.out.println("Getting Companies from the DB by companyID");

        if (table != null) {
            QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("companyID = :id")
                .withValueMap(new ValueMap().withString(":id", companyID));

            try {
                ItemCollection<QueryOutcome> items = table.query(spec);
                for (Item item : items) {
                    UserCompany pair = new UserCompany();
                    pair.setCompanyID(item.getString("companyID"));
                    pair.setUserID(item.getString("userID"));
                    // Set other attributes as needed

                    pairs.add(pair);
                }
            } catch (Exception e) {
                System.err.println("Unable to fetch pairs by companyID");
                System.err.println(e.getMessage());
                // Handle the exception (throw, log, etc.)
            }
        }

        return pairs;
    }

    public UserCompany getPairByID(String companyID, String userID){
        UserCompany pair = null;
        Table table = dynamoDBRepo.getTable(AppConstant.USERCOMPANY);
        System.out.println("Getting Pair from the DB");

        if (table != null) {
            GetItemSpec spec = new GetItemSpec()
                    .withPrimaryKey("companyID", companyID, "userID", userID);
    
            try {
                System.out.println("Reading pair....");
                Item outcome = table.getItem(spec);
                System.out.println(outcome);
    
                if (outcome != null) {
                    pair = new UserCompany();
                    pair.setCompanyID(outcome.getString("companyID"));
                    pair.setUserID(outcome.getString("userID"));
                }
    
                return pair;
    
            } catch (Exception e) {
                System.err.println("Unable to read user" + companyID + userID);
                System.err.println(e.getMessage());
            }
        }
        return pair;
    }

}
