import {
    List,
    ListItem,
    ListItemSuffix,
    Card,
    IconButton,
  } from "@material-tailwind/react";
   
  function NextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z"/></svg>
    );
  }
   
  export default function ListWithIcon(props) {
    const { company_id } = props;

    const navigateToCompany = (companyId) => {
      // Construct the URL here. This is just an example.
      const url = `http://127.0.0.1:5173/user/accounts/company/${companyId}`;
      window.location.href = url; // Change the window location to the new URL
    };


    return (
      <Card className="w-96 absolute top-[150%]">
        <List>
          {company_id.length > 0 ? (
            company_id.map((item, index) => (
              <ListItem key={index} ripple={false} className="py-1 pr-1 pl-4">
              <b>{item.toUpperCase()}</b>
                <ListItemSuffix>
                  <IconButton variant="text" color="blue-gray"onClick={() => navigateToCompany(item)}>
                    <NextIcon />
                  </IconButton>
                </ListItemSuffix>
              </ListItem>
            ))
          ) : (
            <h1>No Points Accounts</h1>
          )}
        </List>
      </Card>
    );
  }