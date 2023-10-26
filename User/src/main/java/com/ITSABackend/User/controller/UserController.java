package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.UserService;

import java.util.HashMap;
import java.util.Map;

import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/User")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserService userService;
    
    @PostMapping(value = "/createUser", consumes = "application/json")
    public ResponseEntity createUser(@RequestBody User user){
        try{

            String userId = userService.createUser(user);
            return new ResponseEntity<>(userId, HttpStatus.OK);
            // return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getUser", produces = {"application/json"})
    public User getAllUsers(@PathParam("id") String id){
        try{

            return userService.getUserById(id);

        } catch(Exception e){
            System.err.println(e.getMessage());
            return null;
        }
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

    @DeleteMapping(value = "/deleteUser")
    public ResponseEntity deleteUser(@PathParam("id") String id){
        try{

            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        
        }
    }

    @PutMapping(value ="/updateUser", consumes = "application/json")
    public ResponseEntity updateUser(@RequestBody User user, @PathParam("id") String id){
        try{

            userService.updateUser(user, id);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }




}
