import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

import classes from './dashboardEarnings.module.css';

const AntTabs = withStyles({
  root: {
    textAlign: 'center',
    backgroundColor: 'none',
    width: '80%',
    marginLeft: '10%',
    marginBottom: '0px',
    paddingLeft: '12px',
  },
  indicator: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
})(Tabs);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabContent} p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    border: '1px solid rgba(128,128,128,0.2)',
    borderRadius: '40px',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(3),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#3E7DFF',
      opacity: 1,
    },
    '&$selected': {
      color: '#3E7DFF',
      border: '1px solid #3E7DFF',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#3E7DFF',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#3E7DFF',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(2),
  },
  boxWrap: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '20px',
  },
}));

export default function CustomizedTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.boxWrap}>
      <TabPanel value={value} index={0}>
        <Typography variant="h6">Estimated Earnings</Typography>
        <Typography variant="h1">$68.56</Typography>
        <Typography variant="h5">1.0653 %</Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6">Estimated Earnings</Typography>
        <Typography variant="h1">$98.32</Typography>
        <Typography variant="h5">3.3653 %</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h6">Estimated Earnings</Typography>
        <Typography variant="h1">$148.26</Typography>
        <Typography variant="h5">12.34 %</Typography>
      </TabPanel>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab className={classes.tab} label="Day" />
          <AntTab className={classes.tab} label="Week" />
          <AntTab className={classes.tab} label="APY" />
        </AntTabs>
        <Typography className={classes.padding} />
      </div>
    </div>
  );
}
