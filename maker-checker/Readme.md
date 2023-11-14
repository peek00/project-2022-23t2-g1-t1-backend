# Maker-Checker 

# Testing points update function
1. Go to "View Users" tab
2. Choose any user, take note of the user (may want to take note of email for easy search later on) and click on "View User Details" > "View Accounts"
3. Choose any company that they are with, take note of their point balance with that company, copy User ID
4. Navigate to "Maker Checker" tab
5. Select Company that you chose in step 3
6. Click "Create Request"
7. Click "Select an action" and select "Points Update"
8. Fill in "user_id" with the user ID copied in step 3
9. Fill in "change" with the amount that you want the point balance to change by (e.g. if you want to increase by 100 input 100, if you want to decrease by 100 input -100)
10. Click "Submit Request" (will throw an error if you choose a user that does not have an account with that company)
11. Log in to a different account (necessary because the person that created the request should not be able to approve it)
12. Navigate to "Maker Checker" tab
13. Select the same company as earlier
14. Approve request
15. Navigate to "View Users" tab
16. Find the same user as in step 2 (you may use the search function by typing their email into the search bar)
17. Click on "View User Details" > "View Accounts"
18. Verify if that the point total for the chosen company has changed

# Testing Update User Details function
1. Go to "View Users" tab
2. Choose any user, take note of their email
3. Navigate to "Maker Checker" tab
4. Choose any company that you want to make the change on behalf of 
5. Enter "firstName", "lastName", "role" (can be multiple roles separated by commas without spaces. e.g. User,Owner,Admin) as you wish to change.
6. Enter email that was noted in step 2
7. Click "Submit Request"
8. Log in to a different account (necessary because the person that created the request should not be able to approve it)
9. Navigate to "Maker Checker" tab
10. Select company that you created the request under
11. Approve request
12. Navigate to "View Users" tab
13. Find the same user as in step 2 (you may use the search function by typing their email into the search bar)
14. Verify that their first name, last name and role have changed