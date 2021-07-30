import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Layout from '../../components/layout/layout.js';
import { Typography, Paper, TextField, InputAdornment, Grid, Button, Tooltip } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Skeleton from '@material-ui/lab/Skeleton';
import classes from './dashboard.module.css';
import VaultAssetRow from '../../components/vaultAssetRow';
import VaultCard from '../../components/vaultCard';
import VaultSplitGraph from '../../components/vaultSplitGraph';
import FilterListIcon from '@material-ui/icons/FilterList';

import BigNumber from 'bignumber.js';
import Popover from '@material-ui/core/Popover';
import HelpIcon from '@material-ui/icons/Help';

import SearchIcon from '@material-ui/icons/Search';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import DashboardCharts from '../../components/dashboardCharts';
import DashboardEarnings from '../../components/dashboardEarnings/dashboardEarnings.js';

import Lottie from "lottie-react";
import noInvestmentsAnim from "../../public/lottiefiles/lottie-placeholder.json";

import { formatCurrency } from '../../utils';

import stores from '../../stores/index.js';
import { VAULTS_UPDATED } from '../../stores/constants';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
    padding: theme.spacing(2),
  },
}));


const Podium = ({ vaults, isStableCoin, handlePopoverOpen, handleNavigate }) => (
  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
    {vaults.length > 4 &&
      vaults.slice(0, 3).map((vault, i) => (
        <li key={i}>
          <span style={{ fontSize: '20px', marginRight: "12px" }}>
            {i === 0 ? '🥇' : null}
            {i === 1 ? '🥈' : null}
            {i === 2 ? '🥉' : null}
          </span>
          <span
            href={`/vaults/${vault.nonLowerCaseAddress}`}
            onClick={() => handleNavigate(vault)}
            className={classes.topVaultPerformersLink}
          >
            {`${vault.label} (${vault.version})`} {(vault.apy * 100).toFixed(2)}%{' '}
          </span>
          <HelpIcon
            style={{ cursor: 'pointer', width: 15 }}
            onClick={event => handlePopoverOpen(event, vault, isStableCoin)}
          />
        </li>
      ))}
  </ul>
);

function Dashboard({ changeTheme }) {
  const localClasses = useStyles();
  const router = useRouter();

  function handleNavigate(vault) {
    router.push('/invest/' + vault.nonLowerCaseAddress);
  }
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const storeVaults = stores.investStore.getStore('vaults');
  const storePortfolioBalance = stores.investStore.getStore('portfolioBalanceUSD');
  const storePortfolioGrowth = stores.investStore.getStore('portfolioGrowth');
  const storeHighestHoldings = stores.investStore.getStore('highestHoldings');
  const account = stores.accountStore.getStore('account');

  const localStoragelayout = localStorage.getItem('yearn.finance-invest-layout');
  const localStorageversions = localStorage.getItem('yearn.finance-invest-versions');

  const [topVaultPerformers, setTopVaultPerformers] = useState({ stableCoinVaults: [], ethBTCVaults: [], otherVaults: [] });
  const [vaults, setVaults] = useState(storeVaults);
  const [porfolioBalance, setPorfolioBalance] = useState(storePortfolioBalance);
  const [portfolioGrowth, setPortfolioGrowth] = useState(storePortfolioGrowth);
  const [highestHoldings, setHighestHoldings] = useState(storeHighestHoldings);
  const [search, setSearch] = useState('');
  const [versions, setVersions] = useState(JSON.parse(localStorageversions ? localStorageversions : '[]'));
  const [layout, setLayout] = useState(localStoragelayout ? localStoragelayout : 'grid');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('none');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [investPopoverText, setInvestPopoverText] = useState('');
  const handlePopoverOpen = (event, vault, isStableCoin) => {
    let popoverText = `invest $1,000 and get $${formatCurrency(1000 * (1 + vault.apy))} in a year at current rate. Note that rates are not fixed.`;
    if (!isStableCoin) {
      let symbol = vault.symbol.split(' Vault')[0];
      popoverText = `invest 1 ${symbol} and get ${formatCurrency(1 * (1 + vault.apy))} ${symbol} in a year at current rate. Note that rates are not fixed.`;
    }
    setInvestPopoverText(popoverText);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const vaultsUpdated = () => {
    setVaults(stores.investStore.getStore('vaults'));
    setPorfolioBalance(stores.investStore.getStore('portfolioBalanceUSD'));
    setPortfolioGrowth(stores.investStore.getStore('portfolioGrowth'));
    setHighestHoldings(stores.investStore.getStore('highestHoldings'));
    forceUpdate();
  };
  const getOrderBy = (x) => {
    let y;
    order === 'asc' ? (y = -x) : (y = x);
    return y;
  };
  useEffect(function () {
    stores.emitter.on(VAULTS_UPDATED, vaultsUpdated);

    return () => {
      stores.emitter.removeListener(VAULTS_UPDATED, vaultsUpdated);
    };
  }, []);
  const setTopPerformers = (zapperVaults) => {
    let stableCoinVaults = [];
    let ethBTCVaults = [];
    let otherVaults = [];
    zapperVaults.map((v) => {
      vaults.map((vault) => {
        if (v.address.toLowerCase() === vault.address.toLowerCase()) {
          v.apy = vault.apy?.net_apy;
          v.nonLowerCaseAddress = vault.address;
          v.symbol = vault.symbol;
          v.label = vault.displayName;
        }
        if (v.apy === 'New') {
          v.apy = 0
        }
      });
      if (v.pricePerToken < 1.4 && v.pricePerToken >= 0.9) {
        stableCoinVaults.push(v);
      } else if (v.symbol.indexOf('BTC') > -1 || v.symbol.indexOf('ETH') > -1) {
        ethBTCVaults.push(v);
      } else {
        otherVaults.push(v);
      }
    });
    const vaultSort = (a, b) => {
      if (orderBy === 'none') {
        if (BigNumber(a.apy).gt(BigNumber(b.apy))) {
          return -1;
        } else if (BigNumber(a.apy).lt(BigNumber(b.apy))) {
          return 1;
        }
      }
    };
    stableCoinVaults.sort(vaultSort);
    ethBTCVaults.sort(vaultSort);
    otherVaults.sort(vaultSort);
    setTopVaultPerformers({ stableCoinVaults: stableCoinVaults, ethBTCVaults: ethBTCVaults, otherVaults: otherVaults });
  };
  React.useEffect(() => {
    async function fetchVaultsFromZapper() {
      const response = await fetch('https://api.zapper.fi/v1/vault-stats/yearn?api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241');
      if (response.status === 200) {
        const zapperVaultsJSON = await response.json();
        setTopPerformers(zapperVaultsJSON);
      }
    }
    fetchVaultsFromZapper();
  }, []);
  const filteredVaults = vaults
    .filter((vault) => {
      let returnValue = true;
      if (versions && versions.length > 0) {
        if (versions.includes('Active')) {
          const vaultType = vault.type === 'v2' && !vault.endorsed ? 'Exp' : vault.type;

          returnValue = BigNumber(vault.balance).gt(0) && (versions.length > 1 ? versions.includes(vaultType) : true);
        } else {
          const vaultType = vault.type === 'v2' && !vault.endorsed ? 'Exp' : vault.type;
          returnValue = versions.includes(vaultType);
        }
      }

      if (returnValue === true && search && search !== '' && search !== '_stablecoins_' && search !== '_ethbtc_' && search !== '_others_') {
        returnValue =
          vault.displayName.toLowerCase().includes(search.toLowerCase()) ||
          vault.name.toLowerCase().includes(search.toLowerCase()) ||
          vault.symbol.toLowerCase().includes(search.toLowerCase()) ||
          vault.address.toLowerCase().includes(search.toLowerCase()) ||
          vault.tokenMetadata.displayName.toLowerCase().includes(search.toLowerCase()) ||
          vault.tokenMetadata.name.toLowerCase().includes(search.toLowerCase()) ||
          vault.tokenMetadata.symbol.toLowerCase().includes(search.toLowerCase()) ||
          vault.tokenMetadata.address.toLowerCase().includes(search.toLowerCase());
      }
      let found = false;
      if (search === '_stablecoins_') {
        topVaultPerformers.stableCoinVaults.map((v) => {
          if (v.address.toLowerCase() === vault.address.toLowerCase()) {
            found = true && returnValue;
          }
        });
        returnValue = found;
      } else if (search === '_ethbtc_') {
        topVaultPerformers.ethBTCVaults.map((v) => {
          if (v.address.toLowerCase() === vault.address.toLowerCase()) {
            found = true && returnValue;
          }
        });
        returnValue = found;
      } else if (search === '_others_') {
        topVaultPerformers.otherVaults.map((v) => {
          if (v.address.toLowerCase() === vault.address.toLowerCase()) {
            found = true && returnValue;
          }
        });
        returnValue = found;
      }

      return returnValue;
    })
    .sort((a, b) => {
      if (orderBy === 'none' && search !== '_stablecoins_' && search !== '_ethbtc_' && search !== '_others_') {
        if (BigNumber(a.balanceUSD).gt(BigNumber(b.balanceUSD))) {
          return -1;
        } else if (BigNumber(a.balanceUSD).lt(BigNumber(b.balanceUSD))) {
          return 1;
        } else if (BigNumber(a.tokenMetadata.balance).gt(BigNumber(b.tokenMetadata.balance))) {
          return -1;
        } else if (BigNumber(a.tokenMetadata.balance).lt(BigNumber(b.tokenMetadata.balance))) {
          return 1;
        } else {
          const aType = a.type === 'v2' && !a.endorsed ? 'Exp' : a.type;
          const bType = b.type === 'v2' && !b.endorsed ? 'Exp' : b.type;
          if (aType > bType) {
            return -1;
          } else if (bType > aType) {
            return 1;
          } else {
            return 0;
          }
        }
      } else if (orderBy.id === 'apy') {
        let apyA = a.apy?.net_apy || 0;
        let apyB = b.apy?.net_apy || 0;
        if (BigNumber(apyA).gt(BigNumber(apyB))) {
          return getOrderBy(-1);
        } else if (BigNumber(apyA).lt(BigNumber(apyB))) {
          return getOrderBy(1);
        }
      } else if (orderBy.id === 'name') {
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
          return getOrderBy(1);
        } else if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) {
          return getOrderBy(-1);
        }
      } else if (orderBy.id === 'version') {
        let typeA = a.type;
        let typeB = b.type;
        typeA === 'v2' && !a.endorsed ? (typeA = 'Exp') : null;
        typeB === 'v2' && !b.endorsed ? (typeB = 'Exp') : null;
        if (typeA.toLowerCase() > typeB.toLowerCase()) {
          return getOrderBy(1);
        } else if (typeA.toLowerCase() < typeB.toLowerCase()) {
          return getOrderBy(-1);
        }
      } else if (orderBy.id === 'balance') {
        let balanceA = a.balanceUSD;
        let balanceB = b.balanceUSD;

        if (BigNumber(balanceA).gt(BigNumber(balanceB))) {
          return getOrderBy(-1);
        } else if (BigNumber(balanceA).lt(BigNumber(balanceB))) {
          return getOrderBy(1);
        }
      } else if (orderBy.id === 'available') {
        let availableA = 0;
        let availableB = 0;
        a.tokenMetadata?.balance ? (availableA = a.tokenMetadata?.balance) : (availableA = 0);
        b.tokenMetadata?.balance ? (availableB = b.tokenMetadata?.balance) : (availableB = 0);
        if (BigNumber(availableA).gt(BigNumber(availableB))) {
          return getOrderBy(-1);
        } else if (BigNumber(availableA).lt(BigNumber(availableB))) {
          return getOrderBy(1);
        }
      }
    });

  const onSearchChanged = (event) => {
    setSearch(event.target.value);
  };

  const handleVersionsChanged = (event, newVals) => {
    setVersions(newVals);
    localStorage.setItem('yearn.finance-invest-versions', newVals && newVals.length ? JSON.stringify(newVals) : '');
  };

  const handleLayoutChanged = (event, newVal) => {
    if (newVal !== null) {
      setLayout(newVal);
      localStorage.setItem('yearn.finance-invest-layout', newVal ? newVal : '');
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const renderVaultHeaders = (props) => {
    const { order, orderBy, onRequestSort } = props;

    let headers = [
      { label: 'Name', show: true, id: 'name' },
      { label: 'Version', show: true, id: 'version' },
      {
        label: 'Invested Balance',
        numeric: true,
        show: account && account.address,
        id: 'balance',
      },
      {
        label: 'Available To Deposit',
        numeric: true,
        show: account && account.address,
        id: 'available',
      },
      { label: 'Yearly Growth', numeric: true, show: true, id: 'apy' },
    ];
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead className={classes.tablehead}>
        <TableRow>
          {headers.map(headCell =>
            headCell.show ? (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell)}>
                  <Typography variant="h5" className={classes.fontWeightBold}>
                    {headCell.label}
                  </Typography>
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : null,
          )}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <Layout changeTheme={changeTheme}>
      <Head>
        <title>Dashboard</title>
      </Head>

      {account && account.address && highestHoldings !== 'None' && (

        <div>

        <Paper className={classes.vaultFiltersTop}>
          <div className={classes.vaultFiltersInside}>
          <Typography className={classes.dashboardTitle} variant="h2">My Dashboard</Typography>
            <Button className={classes.dashboardBtn} variant="outlined">Investments</Button>
            <Button className={classes.dashboardBtnDisabled} variant="outlined" disabled>Loans</Button>
            <Button className={classes.dashboardBtnDisabled} variant="outlined" disabled>Collateral</Button>
            <TextField
              className={classes.searchContainer}
              variant="outlined"
              fullWidth
              placeholder="ETH, CRV, ..."
              value={search}
              onChange={onSearchChanged}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup className={classes.layoutToggleButtons} value={layout} onChange={handleLayoutChanged} exclusive>
              <ToggleButton className={classes.layoutToggleButton} value={'grid'}>
                <AppsIcon />
              </ToggleButton>
              <ToggleButton className={classes.layoutToggleButton} value={'list'}>
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Paper>

        <div className={classes.OverviewContainer}>


          <Grid lg={12} md={12} xs={12} sm={12} container spacing={0}>

          <Grid lg={6} md={12} xs={12} sm={12} container spacing={0}>
            <Grid item lg={6} md={6} xs={12} sm={12}>
              <Paper elevation={0} className={classes.overviewCard}>
                <Tooltip arrow={true} title="Lorem ipsum dolor sit amet consectuer dolor sit amet.">
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>

                <div className={classes.overviewText}>
                  <Typography className={classes.overviewTitle} variant="h2">Total Investment Value</Typography>
                  <Typography className={classes.overviewValue} variant="h1" className={classes.headAmount}>
                    {porfolioBalance === null ? <Skeleton style={{ minWidth: '200px ' }} /> : '$ ' + formatCurrency(porfolioBalance)}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} xs={12} sm={12}>
              <Paper elevation={0} className={classes.overviewCard}>
                <Tooltip arrow={true} title="Lorem ipsum dolor sit amet consectuer dolor sit amet.">
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>
                {porfolioBalance !== null ? <VaultSplitGraph vaults={vaults} /> : <Skeleton className={classes.circleSkeleton} variant="circle" width={80} height={80} />}
                <div className={classes.overviewText}>
                  <Typography variant="h2">Highest Balance</Typography>
                  <Typography variant="h1" className={classes.headAmount}>
                    {highestHoldings === null ? (
                      <Skeleton style={{ minWidth: '200px ' }} />
                    ) : highestHoldings === 'None' ? (
                      highestHoldings
                    ) : (
                      highestHoldings.displayName
                    )}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} xs={12} sm={12}>
              <Paper elevation={0} className={classes.overviewCard}>
                <Tooltip arrow={true} title="Lorem ipsum dolor sit amet consectuer dolor sit amet.">
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>
                <div className={classes.overviewText}>
                  <Typography className={classes.overviewTitle} variant="h2">Total Earnings</Typography>
                  <Typography className={classes.overviewValue} variant="h1" className={classes.headAmount}>
                    {porfolioBalance === null ? (
                      <Skeleton style={{ minWidth: '200px ' }} />
                    ) : (
                      '$ ' + formatCurrency(BigNumber(porfolioBalance).times(portfolioGrowth).div(100))
                    )}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} xs={12} sm={12}>
              <Paper elevation={0} className={classes.overviewCard}>
                <Tooltip arrow={true} title="Lorem ipsum dolor sit amet consectuer dolor sit amet.">
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>
                <DashboardEarnings />
              </Paper>
            </Grid>
          </Grid>

          <Grid lg={6} md={12} xs={12} sm={12} container spacing={0}>
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Paper elevation={0} className={classes.overviewCardFull}>
                <Tooltip arrow={true} title="Lorem ipsum dolor sit amet consectuer dolor sit amet.">
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>
                <Grid xs={12} container spacing={0}>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography className={classes.AssetsTitleMain} variant="h2">Portfolio Performance</Typography>
                  </Grid>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <DashboardCharts />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            </Grid>
            </Grid>

        </div>

        <div className={classes.myInvestmentsContainer}>

          <div className={classes.vaultsContainer}>

            <Typography className={classes.AssetsTitleMain} variant="h2">My Investment Portfolio</Typography>



            <Grid container spacing={3}>
              {layout === 'grid' &&
                filteredVaults &&
                filteredVaults.length > 0 &&
                filteredVaults.map((vault, index) => {
                  return <VaultCard key={index} vault={vault} account={account} />;
                })}
              {layout === 'list' && (
                <Grid item xs={12}>
                  <Paper elevation={0} className={classes.tableContainer}>
                    <TableContainer>
                      <Table className={classes.investTable} aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
                        {renderVaultHeaders({
                          order: order,
                          orderBy: orderBy,
                          onRequestSort: handleRequestSort,
                        })}
                        <TableBody>
                          {filteredVaults &&
                            filteredVaults.length > 0 &&
                            filteredVaults.map((vault, index) => {
                              return <VaultAssetRow key={index} vault={vault} account={account} />;
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </div>
        </div>

        </div>
      )}


      <Paper className={classes.vaultFilters}>
        <div className={classes.vaultFiltersInside}>
          <ToggleButtonGroup className={classes.vaultTypeButtons} value={versions} onChange={handleVersionsChanged}>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('Lockup') ? classes.lockupSelected : classes.lockup}`} value="Lockup">
              <Typography variant="body1">Lockup</Typography>
            </ToggleButton>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('v2') ? classes.v2Selected : classes.v2}`} value="v2">
              <Typography variant="body1">V2</Typography>
            </ToggleButton>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('v1') ? classes.v1Selected : classes.v1}`} value="v1">
              <Typography variant="body1">V1</Typography>
            </ToggleButton>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('Exp') ? classes.expSelected : classes.exp}`} value="Exp">
              <Typography variant="body1">Exp</Typography>
            </ToggleButton>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('Earn') ? classes.earnSelected : classes.earn}`} value="Earn">
              <Typography variant="body1">Earn</Typography>
            </ToggleButton>
            <ToggleButton className={`${classes.vaultTypeButton} ${versions.includes('Active') ? classes.activeSelected : classes.active}`} value="Active">
              <Typography variant="body1">Active</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            className={classes.searchContainer}
            variant="outlined"
            fullWidth
            placeholder="ETH, CRV, ..."
            value={search}
            onChange={onSearchChanged}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup className={classes.layoutToggleButtons} value={layout} onChange={handleLayoutChanged} exclusive>
            <ToggleButton className={classes.layoutToggleButton} value={'grid'}>
              <AppsIcon />
            </ToggleButton>
            <ToggleButton className={classes.layoutToggleButton} value={'list'}>
              <ListIcon />
            </ToggleButton>
          </ToggleButtonGroup >
        </div>
      </Paper>


      <Paper elevation="0" className={classes.noInvestments}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Lottie className={classes.animClass} animationData={noInvestmentsAnim} />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.noneText} variant="h2">You Have No Investments</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.noneSubText} variant="body2">
            Put any crypto you want into any of our investment vaults.
We automatically swap, trade, transfer and manage the end to end process in a fully transparent operation, using strategies at scale to reap collectively greater and more reliable earnings fairly, one more logical reason to grow your crypto with us.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button href="/invest/" variant="outlined" className={classes.browseBtn}>Browse Vaults</Button>
          </Grid>
        </Grid>
      </Paper>


    </Layout>
  );
}

export default Dashboard;
