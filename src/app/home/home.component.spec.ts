import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { AuthGoogleService } from '../auth-google.service';
import { Router } from '@angular/router';
import { AlchemyApiService } from '../services/alchemy-api.service';
import { ApiService } from '../services/api.service';
import { ButtonModule } from 'primeng/button'; // Import ButtonModule
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module'; // Adjust the path as per your project structure


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authGoogleServiceSpy: jasmine.SpyObj<AuthGoogleService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alchemyApiServiceSpy: jasmine.SpyObj<AlchemyApiService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const authGoogleSpy = jasmine.createSpyObj('AuthGoogleService', ['logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alchemyApiSpy = jasmine.createSpyObj('AlchemyApiService', [
      'getBlockNumber',
      'getCurrentGasPrice',
      'getMaxPriorityFeePerGas',
      'getProtocolVersion',
      'getXWalletTransactionCount'
    ]);
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'getTransactionHistory',
      'getXWalletAccountBalance',
      'getTotalValueOperated',
      'getHashRate',
      'getTotalSupply',
      'getApprovalRate'
    ]);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [AppModule,ButtonModule],
      providers: [
        HttpClientTestingModule,
        { provide: AuthGoogleService, useValue: authGoogleSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlchemyApiService, useValue: alchemyApiSpy },
        { provide: ApiService, useValue: apiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authGoogleServiceSpy = TestBed.inject(AuthGoogleService) as jasmine.SpyObj<AuthGoogleService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alchemyApiServiceSpy = TestBed.inject(AlchemyApiService) as jasmine.SpyObj<AlchemyApiService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  afterEach(() => {
    // Clean up after each test
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize the component and fetch data on ngOnInit', () => {
  //   spyOn(component, 'initCharts').and.callThrough();
  //   spyOn(component, 'fetchAlchemyData').and.returnValue(of({
  //     blockNumber: { result: null },
  //     gasPrice: { result: null },
  //     maxPriorityFeePerGas: { result: null },
  //     protocolVersion: { result: null },
  //     xWalletTransactCount: { result: null }
  //   }));
  //   spyOn(component, 'fetchBackendData').and.returnValue(of({
  //     transactionHistory: [],
  //     xWalletBalance: { balance: 0 },
  //     operatedTotalValueRes: { totalValueOperated: 0 },
  //     hashRateRes: { hashRate: 0 },
  //     totalSupply: { totalSupply: 0 }
  //   }));
  //   // spyOn(component, 'fetchApprovalRate').and.returnValue(of({}));

  //   component.ngOnInit();

  //   expect(component.initCharts).toHaveBeenCalled();
  //   expect(component.fetchAlchemyData).toHaveBeenCalled();
  //   expect(component.fetchBackendData).toHaveBeenCalled();
  //   expect(component.fetchApprovalRate).toHaveBeenCalled();
  // });

  it('should fetch Alchemy data and update infoData', () => {
    const mockResponse = {
      blockNumber: { result: 123 },
      gasPrice: { result: '100' },
      maxPriorityFeePerGas: { result: '10' },
      protocolVersion: { result: '1.0' },
      xWalletTransactCount: { result: 5 }
    };

    alchemyApiServiceSpy.getBlockNumber.and.returnValue(of(mockResponse.blockNumber));
    alchemyApiServiceSpy.getCurrentGasPrice.and.returnValue(of(mockResponse.gasPrice));
    alchemyApiServiceSpy.getMaxPriorityFeePerGas.and.returnValue(of(mockResponse.maxPriorityFeePerGas));
    alchemyApiServiceSpy.getProtocolVersion.and.returnValue(of(mockResponse.protocolVersion));
    alchemyApiServiceSpy.getXWalletTransactionCount.and.returnValue(of(mockResponse.xWalletTransactCount));

    component.fetchAlchemyData().subscribe();

    expect(component.infoData.currentBlockNumber).toBe(mockResponse.blockNumber.result);
    expect(component.infoData.currentGasPrice).toBe(mockResponse.gasPrice.result);
    expect(component.infoData.maxPriorityFeePerGas).toBe(mockResponse.maxPriorityFeePerGas.result);
    expect(component.infoData.protocolVersion).toBe(mockResponse.protocolVersion.result);
    expect(component.infoData.xWalletTransactionCount).toBe(mockResponse.xWalletTransactCount.result);
  });

  // it('should handle errors when fetching Alchemy data', () => {
  //   alchemyApiServiceSpy.getBlockNumber.and.returnValue(throwError('Error'));
  //   alchemyApiServiceSpy.getCurrentGasPrice.and.returnValue(throwError('Error'));
  //   alchemyApiServiceSpy.getMaxPriorityFeePerGas.and.returnValue(throwError('Error'));
  //   alchemyApiServiceSpy.getProtocolVersion.and.returnValue(throwError('Error'));
  //   alchemyApiServiceSpy.getXWalletTransactionCount.and.returnValue(throwError('Error'));

  //   component.fetchAlchemyData().subscribe();

  //   expect(component.infoData.currentBlockNumber).toBeUndefined();
  //   expect(component.infoData.currentGasPrice).toBeUndefined();
  //   expect(component.infoData.maxPriorityFeePerGas).toBeUndefined();
  //   expect(component.infoData.protocolVersion).toBeUndefined();
  //   expect(component.infoData.xWalletTransactionCount).toBeUndefined();
  // });

  it('should fetch backend data and update component properties', () => {
    const mockResponse = {
      transactionHistory: [
        { name: 'Transfer', amount: '1000', sender: '0x111', recipient: '0x222', day: '1', month: '1', year: '2023' },
        { name: 'Transfer', amount: '2000', sender: '0x111', recipient: '0x222', day: '1', month: '2', year: '2023' }
      ],
      xWalletBalance: { balance: 1000 },
      operatedTotalValueRes: { totalValueOperated: 5000 },
      hashRateRes: { hashRate: 3000 },
      totalSupply: { totalSupply: 7000 }
    };

    apiServiceSpy.getTransactionHistory.and.returnValue(of(mockResponse.transactionHistory));
    apiServiceSpy.getXWalletAccountBalance.and.returnValue(of(mockResponse.xWalletBalance));
    apiServiceSpy.getTotalValueOperated.and.returnValue(of(mockResponse.operatedTotalValueRes));
    apiServiceSpy.getHashRate.and.returnValue(of(mockResponse.hashRateRes));
    apiServiceSpy.getTotalSupply.and.returnValue(of(mockResponse.totalSupply));

    component.fetchBackendData().subscribe();

    expect(component.recentTransactions.length).toBe(2);
    expect(component.transactionsHistory.length).toBe(2);
    expect(component.xWalletBalance).toBe(mockResponse.xWalletBalance.balance);
    expect(component.operatedTotalValue).toBe(mockResponse.operatedTotalValueRes.totalValueOperated);
    expect(component.hashRate).toBe(mockResponse.hashRateRes.hashRate);
    expect(component.totalSupply).toBe(mockResponse.totalSupply.totalSupply);
  });

  // it('should handle errors when fetching backend data', () => {
  //   apiServiceSpy.getTransactionHistory.and.returnValue(throwError('Error'));
  //   apiServiceSpy.getXWalletAccountBalance.and.returnValue(throwError('Error'));
  //   apiServiceSpy.getTotalValueOperated.and.returnValue(throwError('Error'));
  //   apiServiceSpy.getHashRate.and.returnValue(throwError('Error'));
  //   apiServiceSpy.getTotalSupply.and.returnValue(throwError('Error'));

  //   component.fetchBackendData().subscribe();

  //   expect(component.recentTransactions).toEqual([]);
  //   expect(component.transactionsHistory).toEqual([]);
  //   expect(component.xWalletBalance).toBe(0);
  //   expect(component.operatedTotalValue).toBe(0);
  //   expect(component.hashRate).toBe(0);
  //   expect(component.totalSupply).toBe(0);
  // });

  it('should fetch approval rate and update component property', () => {
    const mockResponse = { approvalRate: 85 };

    apiServiceSpy.getApprovalRate.and.returnValue(of(mockResponse));

    component.fetchApprovalRate().subscribe();

    expect(component.approvalRate).toBe(mockResponse.approvalRate);
  });

  // it('should handle errors when fetching approval rate', () => {
  //   apiServiceSpy.getApprovalRate.and.returnValue(throwError('Error'));

  //   component.fetchApprovalRate().subscribe();

  //   expect(component.approvalRate).toBeNull();
  // });

  it('should log out and navigate to login page', () => {
    component.logOut();
    expect(authGoogleServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
