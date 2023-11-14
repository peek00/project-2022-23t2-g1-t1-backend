<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="images/loyalty.png" alt="Logo" width="600" height="300">

  <p align="center">
    This outlines the project codebase for AY2023/2024 Semester 1 CS301  - G1T1 
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#a">About the Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#configuring-backend">Listing Users</a></li>
	<li><a href="#prerequisites">Enrolling new Users</a></li>
	<li><a href="#prerequisites">Updating User Infromation</a></li>
	<li><a href="#prerequisites">Deleting User Infromation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Our project consists of three backend applications which are the `User Storage ` mircoservice which allow user to list user,enroll new user and update and delete user information.It also consists of the `Point Ledger` microservice which allow user to query point balance of an user and adjust balance of their points account. Lastly we have the `Admin Proxy` application which acts as a gateway betweeen the client and the two applications stated above.


	
## Getting Started

1.  Navigate to our hosted website on this [Appplication Link](https://api.itsag1t1.com/)
2.  We have created an account for our Professors Yeow Leong and Eng Lieh
3.  Click on the `Sign in with Google button`
## Listing Users
<div align="center">

<img src="images/listing_users.png"/>
<p>Upon Signing in as an user, the user will be greeted with all the users that is in the Ascenda Loyalty Application Database</p>
</div>

## Enrolling New Users
<div align="center">

<img src="images/enroll_user.png"/>
<ol>
	<li>User will navigate to the <b>Enroll User<b> tab on the sidebar</li>
	<li>After inputting the user details,the system would navigate back to the user listing page</li>
	<li>To veify the user has been added, please enter the exact email in the search bar, and the new user will be returned</li>
</ol>
</div>

## Updating New Users
<div align="center">

<img src="images/update_user.png"/>
<ol>
	<li>User will navigate to the <b>Update User Details button<b> by clicking on the View User Details Button</li>
	<li>After inputting the new user details, the user would be navigated back to the users listings page</li>
	<li>The user should see a change in the user details on the user listing page</li>
</ol>
</div>


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

* [Calista Lee Yen Ling](https://github.com/cal-lee)
* [Eng T-Leng](https://github.com/T-Leng)
* [Tan Yi Peng](https://github.com/tanyipeng834)
* [Tim Mo Seng](https://github.com/MoSengT)
* [Wu Hao](https://github.com/wuhao212)
* [Yong Lip Khim](https://github.com/JermYong)

<p align="right">(<a href="#top">back to top</a>)</p>
