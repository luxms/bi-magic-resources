import { CanIService } from './services/CanIService';
import { CurrentDsStateService, DatasetService, DsStateService, createSubspaceGenerator } from './services/dataset';
import {
    IDatasetsListItem,
    IDatasetsListModel,
    IDatasetsListTile,
    IRawSummary,
    ISummaryModel,
    SummaryService,
} from './services/services';
import { DashboardByTopicsService, IDashboardsByTopicsModel, IRawDboardDashletMode, IRawDbordTopicMode } from './services/DashboardByTopicsService';
import { getShell, shell, DsShell } from './services/shell';
import { IVizelConfig, IVizelProps } from './defs/types';
import {
    useService,
    useServiceItself,
    useServiceItselfWithCustomSubscription,
    useServiceWithCustomSubscription,
} from './services/useService';
import createService from './services/createService';
import { PluginsManager } from './services/plugins';
import { KoobDataService, KoobFiltersService, KoobService } from './services/koob';
import { ISearchVM, SearchVC, IShellVM, DsShellVC, IDsShellVM, ThemeVC } from './services/view-controllers';
import { Vizel } from './components/Vizel';
import { DatasetsByTopicsService, IDatasetsByTopicsModel, ILocalDataset, ITopic } from './services/DatasetsByTopicsService';
import { TransactionEntitiesService } from './services/TransactionEntitiesService';
import { OpenModalVC } from './ui/OpenModalVC';
import ResourceByNameService from './services/ResourceByNameService';
import { ResourcesOfDatasetsTreeService } from './services/ResourceLocatorService';
import { KoobDimensionsMemberService } from './services/KoobDimensionsMemberService';
import KoobSubspaceAsyncService from './services/KoobSubspaceAsyncService';
import * as service from './services/service';
import * as biquery from './services/biquery';
import { AutoDataSourcesService } from './services/AutoDataSourcesService';
import AutoCubesService from './services/AutoCubesService';
import AutoDimensionsService from './services/AutoDimensionsService';
import MembersLoader from './services/MembersLoader';
import { BasePlugin } from './services/BasePlugin';
import { AtlasHierarchyValuesService, DsVarsService, VarStreamService } from './services/DsVarsService';
import ErrorCollectorVC from './services/ErrorCollectorVC';
import { LpeEvaluatorService } from './services/LpeEvaluatorService';
import { PendingService } from './services/PendingService';

export type {
    IDashboardsByTopicsModel,
    IDatasetsByTopicsModel,
    IDatasetsListItem,
    IDatasetsListModel,
    IDatasetsListTile,
    ILocalDataset,
    IRawDboardDashletMode,
    IRawDbordTopicMode,
    IRawSummary,
    ISearchVM,
    IShellVM,
    ISummaryModel,
    ITopic,
    IDsShellVM,
    IVizelConfig,
    IVizelProps,
};

export {
    CanIService,
    CurrentDsStateService,
    DatasetService,
    DashboardByTopicsService,
    Vizel,
    DsStateService,
    KoobDataService,
    KoobService,
    KoobFiltersService,
    PluginsManager,
    SummaryService,
    shell,
    getShell,
    createService,
    useService,
    useServiceItself,
    useServiceWithCustomSubscription,
    useServiceItselfWithCustomSubscription,
    SearchVC,
    service,
    DsShellVC,
    ThemeVC,
    DsShell,
    createSubspaceGenerator,
    DatasetsByTopicsService,
    TransactionEntitiesService,
    OpenModalVC,
    ResourceByNameService,
    ResourcesOfDatasetsTreeService,
    KoobDimensionsMemberService,
    KoobSubspaceAsyncService,
    biquery,
    AutoDataSourcesService,
    AutoCubesService,
    AutoDimensionsService,
    MembersLoader,
    BasePlugin,
    DsVarsService,
    AtlasHierarchyValuesService,
    VarStreamService,
    ErrorCollectorVC,
    LpeEvaluatorService,
    PendingService,
};

/**
 * Runtime namespace object exported by `bi-internal/services`.
 */
declare const _default: {
    CanIService: typeof CanIService;
    CurrentDsStateService: typeof CurrentDsStateService;
    DatasetService: typeof DatasetService;
    DashboardByTopicsService: typeof DashboardByTopicsService;
    Vizel: typeof Vizel;
    DsStateService: typeof DsStateService;
    KoobDataService: typeof KoobDataService;
    KoobService: typeof KoobService;
    KoobFiltersService: typeof KoobFiltersService;
    PluginsManager: typeof PluginsManager;
    SummaryService: typeof SummaryService;
    shell: typeof shell;
    getShell: typeof getShell;
    createService: typeof createService;
    useService: typeof useService;
    useServiceItself: typeof useServiceItself;
    useServiceWithCustomSubscription: typeof useServiceWithCustomSubscription;
    useServiceItselfWithCustomSubscription: typeof useServiceItselfWithCustomSubscription;
    SearchVC: typeof SearchVC;
    service: typeof service;
    DsShellVC: typeof DsShellVC;
    ThemeVC: typeof ThemeVC;
    DsShell: typeof DsShell;
    createSubspaceGenerator: typeof createSubspaceGenerator;
    DatasetsByTopicsService: typeof DatasetsByTopicsService;
    TransactionEntitiesService: typeof TransactionEntitiesService;
    OpenModalVC: typeof OpenModalVC;
    ResourceByNameService: typeof ResourceByNameService;
    ResourcesOfDatasetsTreeService: typeof ResourcesOfDatasetsTreeService;
    KoobDimensionsMemberService: typeof KoobDimensionsMemberService;
    KoobSubspaceAsyncService: typeof KoobSubspaceAsyncService;
    biquery: typeof biquery;
    AutoDataSourcesService: typeof AutoDataSourcesService;
    AutoCubesService: typeof AutoCubesService;
    AutoDimensionsService: typeof AutoDimensionsService;
    MembersLoader: typeof MembersLoader;
    BasePlugin: typeof BasePlugin;
    DsVarsService: typeof DsVarsService;
    AtlasHierarchyValuesService: typeof AtlasHierarchyValuesService;
    VarStreamService: typeof VarStreamService;
    ErrorCollectorVC: typeof ErrorCollectorVC;
    LpeEvaluatorService: typeof LpeEvaluatorService;
    PendingService: typeof PendingService;
};

export default _default;
