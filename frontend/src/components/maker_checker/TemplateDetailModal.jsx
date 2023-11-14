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

export default function TemplateDetailModal({ data }) {
  //console.log(data)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Template Details
          </Typography>
          <p >
            <span className="py-5 font-bold"> Template Name: </span> {data.type}
          </p>
          <p >
            <span > Template ID: </span> {data.uid}
          </p>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="font-bold">{data.type}</span>
          </Typography>
          <hr></hr>
          {/* Details */}
          <span className="font-bold"> Details </span>
          {Object.keys(data.details).map((key, index) => (
            <div key={index}>
              <p>{key} : {data.details[key]}</p>
            </div>
          ))}
          <hr></hr>
          <p>
            <span className="font-bold"> Allowed Approvers: </span> {data.allowed_approvers}
          </p>
          <p>
            <span className="font-bold"> Allowed Requestors: </span> {data.allowed_requestors}
          </p>
        </Box>
      </Modal>
    </div>
  );
}