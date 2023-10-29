package com.ITSABackend.User.service;

import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ITSABackend.User.repo.DynamoDBRepo;

@ExtendWith(MockitoExtension.class)
public class userServiceTest {
  @Mock
  private DynamoDBRepo dynamoDBRepo;

  @InjectMocks
  private UserService userService;

  @Test
  public void testCreateTable() throws Exception {
    // Mock get table
    when(dynamoDBRepo.getTable(Mockito.anyString())).thenReturn(null);
    // Invoke createTable method
    userService.createTable();
    // Assert createUserTable is called
    Mockito.verify(dynamoDBRepo).createUserTable(true);
  }

  @Test
  public void testDeleteTable() throws Exception {
    // Invoke deleteTable method
    userService.deleteTable("user");
    // Assert deleteTable is called
    Mockito.verify(dynamoDBRepo).deleteTable(Mockito.anyString());
  }
  
}
