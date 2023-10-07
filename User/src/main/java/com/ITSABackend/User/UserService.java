package com.ITSABackend.User;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.mapper.StaticAttributeTags;
import software.amazon.awssdk.enhanced.dynamodb.mapper.UpdateBehavior;
import software.amazon.awssdk.enhanced.dynamodb.model.DeleteItemEnhancedRequest;
import software.amazon.awssdk.enhanced.dynamodb.model.GetItemEnhancedRequest;
import software.amazon.awssdk.enhanced.dynamodb.model.PutItemEnhancedRequest;

public class UserService {

    private final DynamoDbTable<User> userTable;

    public UserService(DynamoDbTable<User> userTable) {
        this.userTable = userTable;
    }

    public User createUser(User user) {
        PutItemEnhancedRequest<User> request = PutItemEnhancedRequest.builder(User.class)
                .item(user)
                .build();

        userTable.putItem(request);

        return user;
    }

    public User getUserById(String userId) {
        GetItemEnhancedRequest getItemRequest = GetItemEnhancedRequest.builder()
                .key(Key.builder().partitionValue(userId).build())
                .build();

        return userTable.getItem(getItemRequest);
    }

    public User updateUser(String userId, User updatedUser) {
        updatedUser.setUserId(userId);

        PutItemEnhancedRequest<User> request = PutItemEnhancedRequest.builder(User.class)
                .item(updatedUser)
                .build();

        userTable.putItem(request);

        return updatedUser;
    }

    public void deleteUser(String userId) {
        DeleteItemEnhancedRequest request = DeleteItemEnhancedRequest.builder()
                .key(Key.builder().partitionValue(userId).build())
                .build();

        userTable.deleteItem(request);
    }
}
