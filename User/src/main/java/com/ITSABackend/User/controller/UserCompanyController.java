package com.ITSABackend.User.controller;

import java.util.HashMap;
import java.util.List;
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

import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.models.UserCompany;
import com.ITSABackend.User.service.RoleService;
import com.ITSABackend.User.service.UserCompanyService;



@RestController
@RequestMapping("/UserCompany")
@CrossOrigin(origins = "*")
@EnableCaching
public class UserCompanyController {
    @Autowired
    UserCompanyService userCompanyService;
    
    @PostMapping(value = "/createPair", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> createRole(@RequestBody UserCompany pair) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            Map<String,Object> data = userCompanyService.createPair(pair);
            response.put("logInfo", "Pair created successfully");
            response.put("data", data);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred while creating Role");
            response.put("data", null);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }


    @GetMapping(value = "/getPair", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getRole(@PathParam("companyID") String companyID, @PathParam("userID") String userID) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            UserCompany pair = userCompanyService.getPairByID(companyID, userID);
            if (pair == null) {
                throw new NullPointerException("Role Doesn't Exist");
            }

            response.put("logInfo", "log message");
            response.put("data", pair);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value="/getPairsFromCompany", produces ={"application/json"})
    public ResponseEntity<Map<String, Object>> getPairsFromCompany(@PathParam("companyID") String companyID){
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            List<UserCompany> pairs = userCompanyService.getPairsByCompanyID(companyID);
            if (pairs == null) {
                throw new NullPointerException("Users in company " + companyID +" doesn't Exist");
            }

            response.put("logInfo", "log message");
            response.put("data", pairs);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);

    }

    @DeleteMapping(value = "/deleteRole/{companyID}/{userID}")
    public ResponseEntity<Map<String, Object>> deleteRole(@PathVariable("companyID") String companyID, @PathVariable("userID") String userID) {
        Map<String, Object> response = new HashMap<>();

        try {
            userCompanyService.deletePair(companyID, userID);
            response.put("logInfo", "Pair deleted successfully");
            response.put("companyID", companyID); 
            response.put("userID", userID);
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            response.put("logInfo", "error occured");
            response.put("data", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    
}
