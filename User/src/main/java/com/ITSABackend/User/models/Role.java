package com.ITSABackend.User.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;




public class Role {
    @DynamoDBHashKey
    private String roleName;

    public String getRoleName() {
        return this.roleName;
    }
    
    public void setRoleName(String name){
        this.roleName = name;
    }
}
