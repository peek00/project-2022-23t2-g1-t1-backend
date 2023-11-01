package com.ITSABackend.User.controller;


import com.ITSABackend.User.models.Role;
import com.ITSABackend.User.models.User;
import com.ITSABackend.User.service.RoleService;


import java.util.HashMap;
import java.util.Map;

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
@RequestMapping("/Role")
@CrossOrigin(origins = "*")
@EnableCaching
public class RoleController {

    @Autowired
    RoleService roleService;
    
    @GetMapping(value = "/getAllRoles", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getAllRoles() {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            response.put("logInfo", "log message");
            response.put("data", roleService.getRoles());

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/createRole", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> createRole(@RequestBody Role role) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            String roleName = roleService.createRole(role);
            response.put("logInfo", "Role created successfully");
            response.put("roleName", roleName);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "Error occurred while creating Role");
            response.put("roleName", null);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }


    @GetMapping(value = "/getRole", produces = {"application/json"})
    public ResponseEntity<Map<String, Object>> getUser(@PathParam("roleName") String roleName) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        try {
            Role roleData = roleService.getRoleByName(roleName);
            if (roleData == null) {
                throw new NullPointerException("Role Doesn't Exist");
            }

            response.put("logInfo", "log message");
            response.put("data", roleData);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            response.put("logInfo", "error occurred");
            response.put("data", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(response, status);
    }

    @DeleteMapping(value = "/deleteRole/{roleName}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable("roleName") String roleName) {
        Map<String, Object> response = new HashMap<>();

        try {
            roleService.deleteRole(roleName);
            response.put("logInfo", "User deleted successfully");
            response.put("data", roleName); 
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            response.put("logInfo", "error occured");
            response.put("data", e.getMessage()); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



}
