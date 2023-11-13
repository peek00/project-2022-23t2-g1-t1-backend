package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.RoleService;
import com.ITSABackend.User.service.UserService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/User")
@CrossOrigin(originPatterns = "*")
@EnableCaching
public class UserController {

    @Autowired
    UserService userService;
    
    @Autowired 
    RoleService roleService;


    @CacheEvict(value = "usersCache", allEntries = true)
    @PostMapping(value = "/createUser", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        
        try {
            Role[] allRoles = roleService.getRoles();
            Set<String> userRoles = user.getRoles();


            Set<String> validRoleNames = Arrays.stream(allRoles)
                                 .map(Role::getRoleName)
                                 .collect(Collectors.toSet());
            
            boolean isValidRoles = userRoles.stream().allMatch(validRoleNames::contains);

            if (isValidRoles){
                String userId = userService.createUser(user);
                response.put("logInfo", "User created successfully");
                Map<String, Object> data = new HashMap<>();
                data.put("userID", userId);
                response.put("data", data);
            }
            else{
                throw new IllegalArgumentException("Invalid role(s) detected in userRoles");
            }
           

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", e.getMessage());
            response.put("userId", null);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/getUser", produces = {"application/json"})
    // @Cacheable(key = "#id", value = "User")
    public ResponseEntity<Map<String, Object>> getUser(@PathParam("userID") String userID) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            User userData = userService.getUserById(userID);
            if (userData == null) {
                throw new NullPointerException("User Doesn't Exist");
            }

            response.put("logInfo", "log message");
            response.put("data", userData);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/getUserByEmail", produces = {"application/json"})
    public ResponseEntity getUserByEmail(@PathParam("email") String email){
        try{
            // System.out.println(email);
            User user = userService.getUserByEmail(email);
            // Map reponse to return id and role
            HashMap<String, Object> response = new HashMap<>();
            response.put("data", user);
            response.put("logs", "retrieved user by email");
  
            // System.out.println(response);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch(Exception e){
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/deleteUser")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathParam("companyID") String companyID, @PathParam("userID") String userID) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.deleteUser(userID);
            response.put("logInfo", "User deleted successfully");
            Map<String, String> data = new HashMap<>();
            data.put("companyID", companyID);
            data.put("userID", userID);
            response.put("data", data);
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            response.put("logInfo", "error occured");
            response.put("data", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @CacheEvict(value = "usersCache", allEntries = true)
    @PutMapping(value = "/updateUser", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody User user, @PathParam("companyID") String companyID, @PathParam("userID") String userID) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            Role[] allRoles = roleService.getRoles();
            Set<String> userRoles = user.getRoles();


            Set<String> validRoleNames = Arrays.stream(allRoles)
                                .map(Role::getRoleName)
                                .collect(Collectors.toSet());
            



            boolean isValidRoles = userRoles.stream().allMatch(validRoleNames::contains);

            if(isValidRoles){
                userService.updateUser(user, userID);
                response.put("logInfo", "User updated successfully");
            }
            else{
                throw new IllegalArgumentException("Invalid role(s) detected in userRoles");
            }
            

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/getAllUsers", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getAllUsers(@RequestParam("isAdmin") boolean isAdmin) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            // Set Default role if not specified
            Role[] allRoles = roleService.getRoles();
            Set<String> validRoleNames = Arrays.stream(allRoles)
                                    .map(Role::getRoleName)
                                    .collect(Collectors.toSet());

            if(!isAdmin){
                // Keep only User Role
                validRoleNames.retainAll(Arrays.asList("User"));
            }
            response.put("logInfo", "log message");
            response.put("data", userService.getAllUsers(validRoleNames));
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    // @GetMapping(value = "/getUserEmails", produces = {"application/json"})
    // public ResponseEntity<Map<String, Object>> getUserEmailsByRole(@RequestBody List<String> userIDs) {
    // Map<String, Object> response = new HashMap<>();
    // HttpStatus status = HttpStatus.OK;

    //     try {
    //         List<String> emails = userService.getUserEmailsFromCompany(userIDs);
    //         if (emails.isEmpty()) {
    //             throw new RuntimeException("No users found with the specified company / role");
    //         }
            
    //         response.put("logInfo", "User emails from entered list retrieved successfully");
    //         response.put("data", emails);
    //     } catch (Exception e) {
    //         System.err.println(e.getMessage());
    //         response.put("logInfo", "Error occurred");
    //         response.put("data", e.getMessage());
    //         status = HttpStatus.INTERNAL_SERVER_ERROR;
    //     }

    //     return new ResponseEntity<>(response, status);
    // }

    @GetMapping(value = "/getUserEmailsByRoleFromList", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getUserEmailsByRoleFromList(@PathParam("roleName") String roleName, @RequestBody List<String> userIDs) {
    Map<String, Object> response = new HashMap<>();
    HttpStatus status = HttpStatus.OK;

        try {
            List<String> emails = userService.getUserEmailsFromCompanyByRole(userIDs, roleName);
            if (emails.isEmpty()) {
                throw new RuntimeException("No users found with the specified company / role");
            }
            
            response.put("logInfo", "User emails from entered list retrieved successfully");
            response.put("data", emails);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value="/getUserEmailsByRole", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getUserEmailsByRole(@RequestBody ArrayList<String> roleNames){
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            List<String> emails = userService.getUsersByRole(roleNames);
            if (emails.isEmpty()) {
                throw new RuntimeException("No users found with the specified company / role");
            }
            
            response.put("logInfo", "User emails retrieved successfully");
            response.put("data", emails);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @Cacheable(value = "usersCache", key = "{#isAdmin, #lastEvaluatedKey}")
    @GetMapping(value = "/getAllUsersPaged", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getAllUsersPaged(@RequestParam("isAdmin") boolean isAdmin, @RequestParam(name = "lastEvaluatedKey", defaultValue = "") String lastEvaluatedKey, @RequestParam(name="email", defaultValue = "") String email){
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            // Set Default role if not specified
            // System.out.println("Pulling from DB");
            Role[] allRoles = roleService.getRoles();
            Set<String> validRoleNames = Arrays.stream(allRoles)
                                    .map(Role::getRoleName)
                                    .collect(Collectors.toSet());

            if(!isAdmin){
                // Keep only User Role
                validRoleNames.retainAll(Arrays.asList("User"));
            }
            response.put("logInfo", "log message");
            response.put("data", userService.getAllUsersPaged(validRoleNames, lastEvaluatedKey, email));
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/getAllUsersByIdList", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getAllUsersByUserIDList(@RequestBody List<String> userIDList){
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            User[] users = userService.getUsersByIdList(userIDList);
            response.put("logInfo", "Retrieved "+users.length+" users Successfully");
            response.put("data", users);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }
}

