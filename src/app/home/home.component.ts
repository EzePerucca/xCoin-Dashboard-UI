import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';
import { Router } from '@angular/router';
import { AlchemyApiService } from '../alchemy-api.service';
import { ApiService } from '../api.service';
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
    pieData: any = null;
    pieOptions: any = null;
    transactions: any[] = [
        { name: '5e69b21a330db2e', date: '17:24:18', amount: 250.00 },
        { name: 'b2eca6578583cce', date: '17:24:02', amount: 125.30 },
        { name: '578583ccca657db', date: '17:23:40', amount: 780.33 },
        { name: 'b2eca6578583cce', date: '17:24:02', amount: 125.30 },
        { name: '578583ccca657db', date: '17:23:40', amount: 780.33 },
        { name: 'b2eca6578583cce', date: '17:24:02', amount: 125.30 },
        { name: '5e69b21a330db2e', date: '17:24:18', amount: 250.00 },
        { name: '578583ccca657db', date: '17:23:40', amount: 780.33 },
        { name: '5e69b21a330db2e', date: '17:24:18', amount: 250.00 },
    ];

    constructor(
        private authGoogleService: AuthGoogleService,
        private router: Router,
        private apiService: ApiService,
        private alchemyApiService: AlchemyApiService
    ) { }

    ngOnInit() {
        this.initCharts();
        // this.getInfoData();
        this.fetchData().subscribe();

        // If you need to refresh data periodically
        interval(60000).pipe( // Adjust the interval as needed
          switchMap(() => this.fetchData())
        ).subscribe();
    }
    
    fetchData() {
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
            )
        }).pipe(
            tap(({ blockNumber, gasPrice }) => {
                console.log('POST response (blockNumber):', blockNumber);
                console.log('POST response (gasPrice):', gasPrice);
                this.infoData.currentBlockNumber = blockNumber.result;
                this.infoData.currentGasPrice = gasPrice.result;
            })
        );
    }

    showData() {
        const data = JSON.stringify(this.authGoogleService.getProfile())
        console.log
    }



    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };

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

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.pieOptions = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
    }

    //#region Session
    logOut() {
        this.authGoogleService.logout();
        this.router.navigate(['login'])
    }
    //#endregion Session
}

