package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.RoleService;
import com.ITSABackend.User.service.UserService;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
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
                response.put("userId", userId);
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
    public ResponseEntity<Map<String, Object>> getUser(@PathParam("id") String id) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            User userData = userService.getUserById(id);
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

    @DeleteMapping(value = "/deleteUser/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable("id") String id) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.deleteUser(id);
            response.put("logInfo", "User deleted successfully");
            response.put("data", id); 
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            response.put("logInfo", "error occured");
            response.put("data", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PutMapping(value = "/updateUser", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody User user, @PathParam("id") String id) {
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
                userService.updateUser(user, id);
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

}

