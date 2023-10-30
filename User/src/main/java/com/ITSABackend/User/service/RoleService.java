package com.ITSABackend.User.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.repo.DynamoDBRepo;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;

import jakarta.annotation.PostConstruct;

public class RoleService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createRoleTable(true);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public Role[] getRoles() throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.USER);
        ArrayList<Role> roles = new ArrayList<Role>();

        if (table != null){

            try{
                System.out.println("Reading user....");
                ItemCollection<ScanOutcome> items = table.scan();
                items.forEach(item -> {
                    System.out.println(item);
                    Role role = new Role();
                    role.setRoleName(item.getString("roleName"));
                    roles.add(role);
                });

            } catch(Exception e){
                System.err.println("Unable to read user");
                System.err.println(e.getMessage());
            }
        }
        return roles.toArray(new Role[roles.size()]);
    }

}
