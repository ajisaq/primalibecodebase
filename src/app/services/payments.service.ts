import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, forkJoin } from "rxjs";
import { environment } from "src/environments/environment";
import { BatService } from "./bat.service";

@Injectable({ providedIn: "root" })
export class PaymentsService {
    onPaymentsChanged: BehaviorSubject<any>;
    payments: any[] = [];

    constructor(
        private _httpClient: HttpClient,
        private batService: BatService
    ) {
        this.onPaymentsChanged = new BehaviorSubject([]);
        this.batService.paymentsAdded.subscribe((paymentIRIs) => {
            // console.log(paymentIRIs);
            const searchUrls: any[] = [];
            paymentIRIs.forEach((paymentIRI) => {
                searchUrls.push(
                    this._httpClient.get(
                        `${environment.serverURL}${paymentIRI}`
                    )
                );
            });

            forkJoin(searchUrls).subscribe((results) => {
                // console.log({ payments: results });
                this.onPaymentsChanged.next(results);
            });
        });
    }
}
