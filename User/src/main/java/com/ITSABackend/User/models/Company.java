package com.ITSABackend.User.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;




public class Company {
    @DynamoDBHashKey
    private String companyID;

    @DynamoDBAttribute
    private String companyName;

    public String getCompanyName() {
        return this.companyName;
    }
    
    public void setCompanyName(String companyName){
        this.companyName = companyName;
    }

    public String getCompanyID(){
        return this.companyID;
    }

    public void setCompanyID(String companyID){
        this.companyID = companyID;
    }
}
