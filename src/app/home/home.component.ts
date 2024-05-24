import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';
import { Router } from '@angular/router';
import { AlchemyApiService } from '../services/alchemy-api.service';
import { ApiService } from '../services/api.service';
import { catchError, forkJoin, interval, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    infoData: any = {};
    chartData: any = null;
    options: any = null;
    currentDate = new Date();
    recentTransactions: any[] = []
    xWalletBalance = 0;
    operatedTotalValue = 0;
    approvalRate = null;
    hashRate = 0;
    totalSupply = 0;
    transactionsHistory: any[] = [];
    // [
    //     // Datos para 2023
    //     { "name": "Transfer", "amount": "3000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "3", "year": "2023" },
    //     { "name": "Transfer", "amount": "4000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "4", "year": "2023" },
    //     { "name": "Transfer", "amount": "5000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "5", "year": "2023" },
    //     { "name": "Transfer", "amount": "6000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "6", "year": "2023" },
    //     { "name": "Transfer", "amount": "7000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "7", "year": "2023" },
    //     { "name": "Transfer", "amount": "8000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "8", "year": "2023" },
    //     { "name": "Transfer", "amount": "9000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "9", "year": "2023" },
    //     { "name": "Transfer", "amount": "10000", "sender": "0x111", "recipient": "0x222", "day": "10", "month": "10", "year": "2023" },
    //     { "name": "Transfer", "amount": "10000", "sender": "0x111", "recipient": "0x222", "day": "10", "month": "10", "year": "2023" },
    //     { "name": "Transfer", "amount": "10000", "sender": "0x111", "recipient": "0x222", "day": "10", "month": "10", "year": "2023" },
    //     { "name": "Transfer", "amount": "11000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "11", "year": "2023" },
    //     { "name": "Transfer", "amount": "11000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "11", "year": "2023" },
    //     { "name": "Transfer", "amount": "12000", "sender": "0x111", "recipient": "0x222", "day": "1", "month": "12", "year": "2023" },
      
    //     // Datos para 2024
    //     { "name": "Transfer", "amount": "13000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "1", "year": "2024" },
    //     { "name": "Transfer", "amount": "14000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "2", "year": "2024" },
    //     { "name": "Transfer", "amount": "15000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "3", "year": "2024" },
    //     { "name": "Transfer", "amount": "15000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "3", "year": "2024" },
    //     { "name": "Transfer", "amount": "15000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "3", "year": "2024" },
    //     { "name": "Transfer", "amount": "15000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "3", "year": "2024" },
    //     { "name": "Transfer", "amount": "15000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "3", "year": "2024" },
    //     { "name": "Transfer", "amount": "16000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "4", "year": "2024" },
    //     { "name": "Transfer", "amount": "17000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "5", "year": "2024" },
    //     { "name": "Transfer", "amount": "17000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "5", "year": "2024" },
    //     { "name": "Transfer", "amount": "17000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "5", "year": "2024" },
    //     { "name": "Transfer", "amount": "17000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "5", "year": "2024" },
    //     { "name": "Transfer", "amount": "18000", "sender": "0x333", "recipient": "0x444", "day": "1", "month": "6", "year": "2024" },
    //   ];
    

    constructor(
        private authGoogleService: AuthGoogleService,
        private router: Router,
        private apiService: ApiService,
        private alchemyApiService: AlchemyApiService
    ) { }

    ngOnInit() {
        this.initCharts();
        this.fetchAlchemyData().subscribe();
        this.fetchBackendData().subscribe();
        this.fetchApprovalRate().subscribe();
        
        
        interval(40000) // Adjust the interval as needed
        .pipe(
            switchMap(() => forkJoin([
                this.fetchAlchemyData(),
                this.fetchBackendData(),
                // this.fetchApprovalRate()
            ]))
        )
        .subscribe(([alchemyData, backendData]) => {

        });
    }
    
    fetchAlchemyData() {
        return forkJoin({
            blockNumber: this.alchemyApiService.getBlockNumber().pipe(
                catchError(error => {
                    console.error('POST error (getBlockNumber):', error);
                    return of({ result: null });
                })
            ),
            gasPrice: this.alchemyApiService.getCurrentGasPrice().pipe(
                catchError(error => {
                    console.error('POST error (getCurrentGasPrice):', error);
                    return of({ result: null });
                })
            ),
            maxPriorityFeePerGas: this.alchemyApiService.getMaxPriorityFeePerGas().pipe(
                catchError(error => {
                    console.error('POST error (getMaxPriorityFeePerGas):', error);
                    return of({ result: null });
                })
            ),
            protocolVersion: this.alchemyApiService.getProtocolVersion().pipe(
                catchError(error => {
                    console.error('POST error (getProtocolVersion):', error);
                    return of({ result: null });
                })
            ),
            xWalletTransactCount: this.alchemyApiService.getXWalletTransactionCount().pipe(
                catchError(error => {
                    console.error('POST error (getProtocolVersion):', error);
                    return of({ result: null });
                })
            ),
        }).pipe(
            tap(({ blockNumber, gasPrice, maxPriorityFeePerGas, protocolVersion, xWalletTransactCount }) => {
                this.infoData.currentBlockNumber = blockNumber.result;
                this.infoData.currentGasPrice = gasPrice.result;
                this.infoData.maxPriorityFeePerGas = maxPriorityFeePerGas.result;
                this.infoData.xWalletTransactionCount = xWalletTransactCount.result;
                this.infoData.protocolVersion = protocolVersion.result;
            })
        );
    }

    fetchBackendData() {
        return forkJoin({
            transactionHistory: this.apiService.getTransactionHistory().pipe(
                catchError(error => {
                    console.error('POST error (getTransactionHistory):', error);
                    return of({ result: null });
                })
            ),
            xWalletBalance: this.apiService.getXWalletAccountBalance().pipe(
                catchError(error => {
                    console.error('POST error (getXWalletAccountBalance):', error);
                    return of({ result: null });
                })
            ),
            operatedTotalValueRes: this.apiService.getTotalValueOperated().pipe(
                catchError(error => {
                    console.error('POST error (getTotalValueOperated):', error);
                    return of({ result: null });
                })
            ),
            hashRateRes: this.apiService.getHashRate().pipe(
                catchError(error => {
                    console.error('POST error (getHashRate):', error);
                    return of({ result: null });
                })
            ),
            totalSupply: this.apiService.getTotalSupply().pipe(
                catchError(error => {
                    console.error('POST error (getTotalSupply):', error);
                    return of({ result: null });
                })
            ),
        }).pipe(
            tap(({ transactionHistory, xWalletBalance, operatedTotalValueRes, hashRateRes, totalSupply }) => {
                this.recentTransactions = transactionHistory.slice(0, 10);
                this.transactionsHistory = transactionHistory;
                this.xWalletBalance = xWalletBalance.balance;
                this.operatedTotalValue = operatedTotalValueRes.totalValueOperated;
                this.hashRate = hashRateRes.hashRate;
                this.totalSupply = totalSupply.totalSupply;
                this.parseDataToChart(); //After getting transaction history
            })
        );
    }

    fetchApprovalRate() {
        return forkJoin({
            approvalRateRes: this.apiService.getApprovalRate().pipe(
                catchError(error => {
                    console.error('POST error (getApprovalRate):', error);
                    return of({ result: null });
                })
            ),
        }).pipe(
            tap(({ approvalRateRes }) => {
                this.approvalRate = approvalRateRes.approvalRate;
            })
        );
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        }
    }

    parseDataToChart(){
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const groupedByYear = this.transactionsHistory.reduce((acc, transaction) => {
            const year = transaction.year;
            if (!acc[year]) {
                acc[year] = Array(12).fill(0);
            }
            const monthIndex = parseInt(transaction.month, 10) - 1;
            acc[year][monthIndex]++;
            return acc;
        }, {});

        const datasets = Object.keys(groupedByYear).map(year => {
            return {
                label: `Transactions in ${year}`,
                data: groupedByYear[year],
                fill: false,
                // borderColor: this.getRandomColor(),
                tension: 0.4
            };
        });

        this.chartData = {
            labels: monthNames,
            datasets: datasets
        }
    }

    //#region Session
    logOut() {
        this.authGoogleService.logout();
        this.router.navigate(['login'])
    }
    //#endregion Session
}

