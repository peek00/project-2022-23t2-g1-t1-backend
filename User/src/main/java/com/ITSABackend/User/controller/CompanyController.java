package com.ITSABackend.User.controller;

import com.ITSABackend.User.models.Company;
import com.ITSABackend.User.service.CompanyService;
import java.util.HashMap;
import java.util.Map;
import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Company")
@CrossOrigin(origins = "*")
@EnableCaching
public class CompanyController {
    
    @Autowired
    CompanyService companyService;
    
    @GetMapping(value = "/getAllCompanies", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getAllCompanies() {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            response.put("logInfo", "log message");
            response.put("data", companyService.getCompanies());

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/createCompany", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> createCompany(@RequestBody Company company) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            String companyName = companyService.createCompany(company);
            response.put("logInfo", "Company created successfully");
            response.put("companyName", companyName);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred while creating Company");
            response.put("companyName", null);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }


    @GetMapping(value = "/getCompany", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getCompany(@PathParam("companyID") String companyID) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            Company companyData = companyService.getCompanyByID(companyID);
            if (companyData == null) {
                throw new NullPointerException("Company Doesn't Exist");
            }

            response.put("logInfo", "log message");
            response.put("data", companyData);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @DeleteMapping(value = "/deleteCompany/{companyID}")
    public ResponseEntity<Map<String, Object>> deleteCompany(@PathVariable("companyID") String companyID) {
        Map<String, Object> response = new HashMap<>();

        try {
            companyService.deleteCompany(companyID);
            response.put("logInfo", "Company deleted successfully");
            response.put("data", companyID); 
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            response.put("logInfo", "error occured");
            response.put("data", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}
