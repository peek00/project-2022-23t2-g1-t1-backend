package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.UserService;

import java.util.List;
import javax.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;
    
    @PostMapping(value = "/createUser", consumes = "application/json")
    public ResponseEntity createUser(@RequestBody User user){
        try{
            userService.createUser(user);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getUser", produces = {"application/json"})
    public ResponseEntity<User> getAllUsers(@PathParam("bankId")String bankId, @PathParam("userId") String userId){
        try{

            return new ResponseEntity(userService.getUserById(bankId,userId), HttpStatus.OK);

        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "deletetable/{bankId}/{userId}")
    public ResponseEntity deleteUser(@PathParam("bankId") String bankId, @PathParam("userId") String userId){
        try{

            userService.deleteUser(bankId, userId);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        
        }
    }

    @PutMapping(value ="/updateUser", consumes = "application/json")
    public ResponseEntity updateUser(@RequestBody User user){
        try{
            userService.updateUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }




}
