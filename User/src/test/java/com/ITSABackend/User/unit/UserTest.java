package com.ITSABackend.User.unit;

import org.junit.jupiter.api.Test;
import com.ITSABackend.User.models.User;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashSet;
import java.util.Set;

public class UserTest {

    @Test
    public void testUserId() {
        User user = new User();
        user.setUserId("123");

        assertEquals("123", user.getUserId());
    }

    @Test
    public void testFirstName() {
        User user = new User();
        user.setfirstName("John");

        assertEquals("John", user.getfirstName());
    }

    @Test
    public void testLastName() {
        User user = new User();
        user.setlastName("Doe");

        assertEquals("Doe", user.getlastName());
    }

    @Test
    public void testFullName() {
        User user = new User();
        user.setfirstName("John");
        user.setlastName("Doe");

        assertEquals("John Doe", user.getFullName());
    }

    @Test
    public void testEmail() {
        User user = new User();
        user.setEmail("john.doe@example.com");

        assertEquals("john.doe@example.com", user.getEmail());
    }

    @Test
    public void testRoles() {
        User user = new User();
        Set<String> roles = new HashSet<>();
        roles.add("Admin");
        roles.add("User");
        user.setRole(roles);

        assertEquals(roles, user.getRoles());
    }
}
