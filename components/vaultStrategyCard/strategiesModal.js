import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import VaultStrategyCard from '../../pages/invest/[address]/testModal.js';



const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid rgba(104,108,122,0.4)',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '80px',
    left: '50%',
    marginLeft: '-300px',
    borderRadius: '10px',
  },
  strategiesBtn: {
    border: '1px solid rgba(104,108,122,0.3)',
    background: 'none',
    width: '220px',
    color: '#FFF',
    padding: '15px 0',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '5px',
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Vault Strategies</h2>
      <VaultStrategyCard />
    </div>
  );

  return (
    <div>
      <button className={classes.strategiesBtn} type="button" onClick={handleOpen}>
        View Vault Strategies
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
