package com.ITSABackend.User.service;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;

import jakarta.annotation.PostConstruct;

@Service
public class RoleService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createRoleTable(false);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public String createRole(Role role) throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.ROLE);

        try{
            PutItemOutcome outcome = table.putItem(new Item().withPrimaryKey("roleName", role.getRoleName()));
            System.out.println("Create role success\n" + outcome.getPutItemResult());
            return role.getRoleName();

        } catch(Exception e){
            System.out.println(" Only error");
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create role");

        }

    }

    public void deleteRole(String roleName){
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
            .withPrimaryKey(new PrimaryKey("roleName", roleName));
        
        try {

            Table table = dynamoDBRepo.getTable(AppConstant.ROLE);
            System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            System.out.println("Item deleted, Successful");

        } catch (Exception e){
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
        
    }
    

    public Role[] getRoles() throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.ROLE);
        ArrayList<Role> roles = new ArrayList<Role>();

        if (table != null){

            try{
                System.out.println("Reading Roles....");
                ItemCollection<ScanOutcome> items = table.scan();
                items.forEach(item -> {
                    System.out.println(item);
                    Role role = new Role();
                    role.setRoleName(item.getString("roleName"));
                    roles.add(role);
                });

            } catch(Exception e){
                System.err.println("Unable to read Roles");
                System.err.println(e.getMessage());
            }
        }
        return roles.toArray(new Role[roles.size()]);
    }

    public Role getRoleByName(String roleName){
        Role role = null;
        Table table = dynamoDBRepo.getTable(AppConstant.ROLE);
        System.out.println("Getting Role from the DB");

        if (table != null){
            GetItemSpec spec = new GetItemSpec().withPrimaryKey("roleName", roleName);

            try{
                System.out.println("Reading Role....");
                Item outcome = table.getItem(spec);

                if (outcome != null){
                    role = new Role();
                    role.setRoleName(outcome.getString("roleName"));
                    
                }

                return role;

            } catch(Exception e){
                System.err.println("Unable to read role" + roleName);
                System.err.println(e.getMessage());
            }
        }
        return role;

    }

}
