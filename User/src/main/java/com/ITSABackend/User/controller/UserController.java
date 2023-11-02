package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.RoleService;
import com.ITSABackend.User.service.UserService;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

// import java.util.HashMap;
// import java.util.Map;

import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
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
@CrossOrigin(origins = "http://localhost:5173")
@EnableCaching
// @CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserService userService;
    
    @Autowired 
    RoleService roleService;

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
                Map<String, String> data = new HashMap<>();
                data.put("companyID", user.getCompanyId());
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
    public ResponseEntity<Map<String, Object>> getUser(@PathParam("companyID") String companyID, @PathParam("userID") String userID) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            User userData = userService.getUserById(companyID, userID);
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
            System.out.println(email);
            User user = userService.getUserByEmail(email);
            // Map reponse to return id and role
            HashMap<String, Object> response = new HashMap<>();
            response.put("id", user.getUserId());
            response.put("role", user.getRoles());
            System.out.println(response);

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
            userService.deleteUser(companyID, userID);
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
                userService.updateUser(user, companyID, userID);
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
    public ResponseEntity<Map<String, Object>> getAllUsers(@RequestParam(required=false) String role) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            // Set Default role if not specified
            Role[] allRoles = roleService.getRoles();
            Set<String> validRoleNames = Arrays.stream(allRoles)
                                    .map(Role::getRoleName)
                                    .collect(Collectors.toSet());
            if (role == null ){
                role = "User";
            } else if (!validRoleNames.contains(role)){
                throw new IllegalArgumentException("Invalid role(s) detected in userRoles");
            }
            response.put("logInfo", "log message");
            response.put("data", userService.getAllUsers(role));

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/getUserEmailsByRole", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getUserEmailsByRole(@PathParam("companyID") String companyID, @PathParam("roleName") String roleName) {
    Map<String, Object> response = new HashMap<>();
    HttpStatus status = HttpStatus.OK;

        try {
            // Call your service method to get users by role and company
            List<User> users = userService.getUsersByRoleFromCompany(companyID, roleName);
            if (users.isEmpty()) {
                throw new RuntimeException("No users found with the specified company / role");
            }

            // Extract emails from user objects
            List<String> emails = users.stream().map(User::getEmail).collect(Collectors.toList());

            response.put("logInfo", "Users with role " + roleName + " retrieved successfully");
            response.put("data", emails);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value="/getUsersByCompany", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getUsersByCompany(@PathParam("companyID") String companyID){
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;


        try{
            List<User> users = userService.getUsersByCompany(companyID);
            if (users.isEmpty()) {
                throw new RuntimeException("No users found with the specified role");
            }

            response.put("logInfo", "Users from company" + companyID + " retrieved successfully");
            response.put("data", users);
        }catch(Exception e){
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;

        }
        return new ResponseEntity<>(response, status);

    }


}

