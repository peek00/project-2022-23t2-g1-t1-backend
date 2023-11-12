// package com.ITSABackend.User.service;


// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import com.ITSABackend.User.constant.AppConstant;
// import com.ITSABackend.User.models.User;
// import com.ITSABackend.User.repo.DynamoDBRepo;
// import com.ITSABackend.User.service.UserService;
// import com.amazonaws.services.dynamodbv2.document.Table;
// import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
// import com.amazonaws.services.dynamodbv2.document.Item;

// import org.assertj.core.api.Assertions;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// import java.util.HashSet;
// import java.util.Optional;
// import java.util.Set;

// public class serviceTest {

//     @Mock
//     private DynamoDBRepo dynamoDBRepo;

//     @Mock
//     private Table mockTable;

//     @InjectMocks
//     private UserService userService;

//     @BeforeEach
//     public void init() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void service_getUserByID(){
//         User user = new User();
//         user.setUserId("1234");
//         user.setEmail("test@gmail.com");

//         when(dynamoDBRepo.getTable(AppConstant.USER)).thenReturn(mockTable);
//         GetItemSpec spec = new GetItemSpec()
//                     .withPrimaryKey("userID", "1234");
        
//         when(mockTable.getItem(spec)).thenReturn(new Item());

//         User savedUser = userService.getUserById("1234");
//         Assertions.assertThat(savedUser).isNotNull();
//     }

//     // Write similar tests for other methods in UserService

// }
