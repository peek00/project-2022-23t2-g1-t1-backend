package com.ITSABackend.User.service;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ITSABackend.User.constant.AppConstant;
import com.ITSABackend.User.models.Company;
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
public class CompanyService {
    @Autowired 
    DynamoDBRepo dynamoDBRepo;
    
    @PostConstruct
    public void createTable() throws Exception{
        dynamoDBRepo.createCompanyTable(false);
    }

    public void deleteTable(String tableName) throws Exception{
        dynamoDBRepo.deleteTable(tableName);
    }

    public String createCompany(Company company) throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.COMPANY);

        try{
            PutItemOutcome outcome = table.putItem(new Item()
                                    .withPrimaryKey("companyID", company.getCompanyID())
                                    .with("companyName", company.getCompanyName()));
            System.out.println("Create company success\n" + outcome.getPutItemResult());
            return company.getCompanyID();

        } catch(Exception e){
            System.out.println(" Only error");
            System.out.println(e.getMessage());
            throw new IllegalStateException("Unable to create Company");

        }

    }

    public void deleteCompany(String companyID){
        DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
            .withPrimaryKey(new PrimaryKey("companyID", companyID));
        
        try {

            Table table = dynamoDBRepo.getTable(AppConstant.COMPANY);
            System.out.println("Deleting item....");
            table.deleteItem(deleteItemSpec);
            System.out.println("Item deleted, Successful");

        } catch (Exception e){
            System.err.println("Unable to delete item.");
            System.err.println(e.getMessage());
        }
        
    }
    

    public Company[] getCompanies() throws Exception{
        Table table = dynamoDBRepo.getTable(AppConstant.COMPANY);
        ArrayList<Company> companies = new ArrayList<Company>();

        if (table != null){

            try{
                System.out.println("Reading Company....");
                ItemCollection<ScanOutcome> items = table.scan();
                items.forEach(item -> {
                    System.out.println(item);
                    Company company = new Company();
                    company.setCompanyID(item.getString("companyID"));
                    company.setCompanyName(item.getString("companyName"));
                    companies.add(company);
                });

            } catch(Exception e){
                System.err.println("Unable to read Companies");
                System.err.println(e.getMessage());
            }
        }
        return companies.toArray(new Company[companies.size()]);
    }

    public Company getCompanyByID(String companyID){
        Company company = null;
        Table table = dynamoDBRepo.getTable(AppConstant.COMPANY);
        System.out.println("Getting Company from the DB");

        if (table != null){
            GetItemSpec spec = new GetItemSpec().withPrimaryKey("companyID", companyID);

            try{
                System.out.println("Reading Company....");
                Item outcome = table.getItem(spec);

                if (outcome != null){
                    company = new Company();
                    company.setCompanyID(outcome.getString("companyID"));
                    company.setCompanyName(outcome.getString("companyName"));
                    
                }

                return company;

            } catch(Exception e){
                System.err.println("Unable to read user" + companyID);
                System.err.println(e.getMessage());
            }
        }
        return company;

    }

}
