import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function RequestDetailModal({ data }) {
  //console.log(data)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const requestDetails = data.request_details;

  function getElapsedRelativeTime(timestamp) {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const timeDifference = now - timestampDate;

    if (timeDifference < 0) {
      return false;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours > 1 ? "s" : ""
        } ago`;
    } else if (hours > 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""
        } ago`;
    } else {
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }
  }
  return (
    <div>
      <Button onClick={handleOpen}>More Details</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Request Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="font-bold">{data.request_type}</span>
          </Typography>
          <hr></hr>
          {/* Details */}
          <span className="font-bold"> Details </span>
          {Object.keys(requestDetails).map((key, index) => (
            <div key={index}>
              <p>{key} : {requestDetails[key]}</p>
            </div>
          ))}
          <hr></hr>
          {/* Comments */}
          <p>
            <span className="font-bold"> Made by: </span> {data.requestor_id}
          </p>
          <p>
            <span className="font-bold"> Made on: </span> {getElapsedRelativeTime(data.created_at)}
          </p>

        </Box>
      </Modal>
    </div>
  );
}