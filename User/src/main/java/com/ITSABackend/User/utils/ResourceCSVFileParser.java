package com.ITSABackend.User.utils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import com.ITSABackend.User.models.User;


public class ResourceCSVFileParser {
  public ArrayList<User> retrieveUserFromCsv() {
    enum Header {
      id, email, first_name, last_name, role
    }
    ArrayList<User> users = new ArrayList<User>();
    // Read from resources folder
    try {
      InputStream in = getClass().getResourceAsStream("/users.csv");
      InputStreamReader reader = new InputStreamReader(in);
      Iterable<CSVRecord> records = CSVFormat.Builder.create(CSVFormat.DEFAULT).setHeader(Header.class).build().parse(reader);
      int line = 0;
      for (CSVRecord csvRecord : records) {
        if (line == 0 || csvRecord.get(Header.id).isEmpty()) {
          line++;
          continue;
        }
        User user = new User();
        user.setUserId(csvRecord.get(Header.id));
        user.setEmail(csvRecord.get(Header.email));
        user.setfirstName(csvRecord.get(Header.first_name));
        user.setlastName(csvRecord.get(Header.last_name));
        if (csvRecord.get(Header.role).isEmpty()) {
          user.setRole(new HashSet<String>(Arrays.asList("user")));
        } else {
          user.setRole(new HashSet<String>(Arrays.asList(csvRecord.get(Header.role).split(","))));
        }

        // Input validation:
        if (user.getUserId().isEmpty() || user.getEmail().isEmpty() || user.getfirstName().isEmpty() || user.getlastName().isEmpty()) {
          System.out.println("Invalid input for user at line" + line + " in users.csv");
        } else {
          users.add(user);
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    } 
    return users;
  };
}
