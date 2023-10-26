package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.UserService;

import java.util.HashMap;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/User")
@EnableCaching
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserService userService;
    
    @PostMapping(value = "/createUser", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            String userId = userService.createUser(user);
            response.put("logInfo", "User created successfully");
            response.put("userId", userId);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred while creating user");
            response.put("userId", null);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/getUser", produces = {"application/json"})
    @Cacheable(key = "#id", value = "User")
    public ResponseEntity<Map<String, Object>> getAllUsers(@PathParam("id") String id) {
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
            Map<String,String> response = new HashMap<>();
            response.put("id", user.getUserId());
            response.put("role", user.getRole());
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
            userService.updateUser(user, id);
            response.put("logInfo", "User updated successfully");
        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred while updating user");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }





}
