import { erc20ABI } from './erc20ABI';
import { vaultV1ABI } from './vaultV1ABI';
import { vaultV2ABI } from './vaultV2ABI';
import { balancerProxyABI } from './balancerProxyABI';
import { earnABI } from './earnABI';
import { comptrollerABI } from './comptrollerABI';
import { creamPriceOracleABI } from './creamPriceOracleABI';
import { cERC20DelegatorABI } from './cERC20DelegatorABI';
import { lockupABI } from './lockupABI';
import { votingEscrowABI } from './votingEscrowABI';
import { cdpVaultABI } from './cdpVaultABI';
import { keep3rV1OracleABI } from './keep3rV1OracleABI';
import { oracleRegistryABI } from './oracleRegistryABI';
import { vaultManagerParamsABI } from './vaultManagerParamsABI';
import { vaultParametersABI } from './vaultParametersABI';
import { ltvMaximizerABI } from './ltvMaximizerABI';
import { vaultManagerKeep3rSushiSwapMainAssetABI } from './vaultManagerKeep3rSushiSwapMainAssetABI';
import { vaultManagerKeep3rMainAssetABI } from './vaultManagerKeep3rMainAssetABI';
import { vaultMangerStandardABI } from './vaultMangerStandardABI';
import { collateralRegistryABI } from './collateralRegistryABI';
import { uniswapPairABI } from './uniswapPairABI';
import { chainlinkOracleABI } from './chainlinkOracleABI';
import { ironBankRegistryAdapterABI } from './ironBankRegistryAdapterABI';
import { cdpManager01ABI } from './cdpManager01ABI';
import { comp_tokenABI } from './comp_tokenABI';
import { curve_poolContractABI } from './curve_poolContractABI';
import { iearn_tokenABI } from './iearn_tokenABI';
import { vault_AaveLenderLINKBorrowerSUSDABI } from './vault_AaveLenderLINKBorrowerSUSDABI';
import { vault_AaveWETHLenderUSDTBorrowerABI } from './vault_AaveWETHLenderUSDTBorrowerABI';
import { vault_StrategyIdleidleRAIYieldABI } from './vault_StrategyIdleidleRAIYieldABI';
import { vault_StrategyLenderYieldOptimiserABI } from './vault_StrategyLenderYieldOptimiserABI';
import { vault_StrategyMakerLINKDAIDelegateABI } from './vault_StrategyMakerLINKDAIDelegateABI';
import { vault_StrategyMakerUNIDAIDelegateABI } from './vault_StrategyMakerUNIDAIDelegateABI';
import { vault_StrategyPoolABI } from './vault_StrategyPoolABI';
import { vault_StrategyRookDaiStablecoinABI } from './vault_StrategyRookDaiStablecoinABI';
import { vault_StrategysteCurveWETHSingleSidedABI } from './vault_StrategysteCurveWETHSingleSidedABI';
import { vault_StrategyeCurveWETHSingleSidedABI } from './vault_StrategyeCurveWETHSingleSidedABI';
import { vault_StrategyVesperWBTCABI } from './vault_StrategyVesperWBTCABI';
import { yearnVault0_3_3ABI } from './yearnVault0_3_3ABI';
import { veCurveVaultABI } from './veCurveVaultABI';
import { aaveTokenABI } from './aaveTokenABI';
import { otherAaveTokenABI } from './otherAaveTokenABI';
import { CRV3TokenABI } from './CRV3TokenABI';
import { vault_USDCABI } from './vault_USDCABI';
import { vault_StrategyMKRVaultDAIDelegateABI } from './vault_StrategyMKRVaultDAIDelegateABI';
import { vault_StrategyYPoolABI } from './vault_StrategyYPoolABI';
import { vault_StrategyGenericLevCompFarmABI } from './vault_StrategyGenericLevCompFarmABI';
import { vault_StrategySingleSidedCrvABI } from './vault_StrategySingleSidedCrvABI'
import { curve_stePoolContractABI } from './curve_stePoolContractABI';
import { curve_saPoolContractABI } from './curve_saPoolContractABI';
import { vault_StrategySynthetixSusdMinterABI } from './vault_StrategySynthetixSusdMinterABI';
import { fixedUSDABI } from './fixedUSDABI';
import { trustedVaultMigratorABI } from './trustedVaultMigratorABI'

export const COMP_TOKENABI = comp_tokenABI;
export const CURVE_POOLCONTRACTABI = curve_poolContractABI;
export const IEARN_TOKENABI = iearn_tokenABI;
export const VAULT_AaveLenderLINKBorrowerSUSDABI = vault_AaveLenderLINKBorrowerSUSDABI;
export const VAULT_AaveWETHLenderUSDTBorrowerABI = vault_AaveWETHLenderUSDTBorrowerABI;
export const VAULT_StrategyIdleidleRAIYieldABI = vault_StrategyIdleidleRAIYieldABI;
export const VAULT_StrategyLenderYieldOptimiserABI = vault_StrategyLenderYieldOptimiserABI;
export const VAULT_StrategyMakerLINKDAIDelegateABI = vault_StrategyMakerLINKDAIDelegateABI;
export const VAULT_StrategyMakerUNIDAIDelegateABI = vault_StrategyMakerUNIDAIDelegateABI;
export const VAULT_StrategyPoolABI = vault_StrategyPoolABI;
export const VAULT_StrategyRookDaiStablecoinABI = vault_StrategyRookDaiStablecoinABI;
export const VAULT_StrategysteCurveWETHSingleSidedABI = vault_StrategysteCurveWETHSingleSidedABI;
export const VAULT_StrategyeCurveWETHSingleSidedABI = vault_StrategyeCurveWETHSingleSidedABI;
export const VAULT_StrategyVesperWBTCABI = vault_StrategyVesperWBTCABI;
export const YEARNVAULT_0_3_3ABI = yearnVault0_3_3ABI;
export const VECURVEVAULTABI = veCurveVaultABI;
export const AAVETOKENABI = aaveTokenABI;
export const OTHERAAVETOKENABI = otherAaveTokenABI;
export const CRV3TOKENABI = CRV3TokenABI;
export const VAULT_USDCABI = vault_USDCABI;
export const VAULT_StrategyMKRVaultDAIDelegateABI = vault_StrategyMKRVaultDAIDelegateABI;
export const VAULT_StrategyYPoolABI = vault_StrategyYPoolABI
export const VAULT_StrategyGenericLevCompFarmABI = vault_StrategyGenericLevCompFarmABI;
export const VAULT_StrategySingleSidedCrvABI = vault_StrategySingleSidedCrvABI
export const CURVE_STEPOOLCONTRACTABI = curve_stePoolContractABI
export const CURVE_SAPOOLCONTRACTABI = curve_saPoolContractABI
export const VAULT_StrategySynthetixSusdMinterABI = vault_StrategySynthetixSusdMinterABI
export const IRONBANKREGISTRYADAPTERABI = ironBankRegistryAdapterABI;
export const ERC20ABI = erc20ABI;
export const VAULTV1ABI = vaultV1ABI;
export const VAULTV2ABI = vaultV2ABI;
export const BALANCERPROXYABI = balancerProxyABI;
export const EARNABI = earnABI;
export const COMPTROLLERABI = comptrollerABI;
export const CREAMPRICEORACLEABI = creamPriceOracleABI;
export const CERC20DELEGATORABI = cERC20DelegatorABI;
export const LOCKUPABI = lockupABI;
export const VOTINGESCROWABI = votingEscrowABI;
export const CDPVAULTABI = cdpVaultABI;
export const KEEP3RV1ORACLEABI = keep3rV1OracleABI;
export const ORACLEREGISTRYABI = oracleRegistryABI;
export const VAULTMANAGERPARAMSABI = vaultManagerParamsABI;
export const VAULTPARAMETERSABI = vaultParametersABI;
export const LTVMAXIMIZERABI = ltvMaximizerABI;
export const VAULTMANAGERKEEP3RSUSHIABI = vaultManagerKeep3rSushiSwapMainAssetABI;
export const VAULTMANAGERKEEP3RABI = vaultManagerKeep3rMainAssetABI;
export const VAULTMANAGERSTANDARDABI = vaultMangerStandardABI;
export const COLLATERALREGISTRYABI = collateralRegistryABI;
export const UNISWAPPAIRABI = uniswapPairABI;
export const CHAINLINKORACLEABI = chainlinkOracleABI;
export const CDPMANAGER01ABI = cdpManager01ABI;
export const FIXEDUSDABI = fixedUSDABI;
export const TRUSTEDVAULTMIGRATORABI = trustedVaultMigratorABI;
