package com.ITSABackend.User;

public interface UserRepository {

    void createUser(User user);

    User getUserById(String userId);

    void updateUser(String userId, User updatedUser);

    void deleteUserById(String userId);
}
