import { environment } from '../../environments/environment';
import { ceil, toInteger } from 'lodash';

export class Paginator {

    totalItems: number;
    current: string;
    first: string;
    next: string;
    previous: string;
    last: string;
    toCall: (page: string) => any;
    funcName: string;
    service: object;

    currentPageNo: number;
    firstPageNo: number;
    lastPageNo: number;

    pages: { label: number, value: string }[] = [];
    itemsPerPage: number;
    itemsPageStartIndex: number;

    recordSummary: string;
    pageSummary: string;

    /**
     * Constructor
     *
     * @param paginator
     */
    constructor(paginator = {}, service, totalItems, funcName, perPage = 8) {
        this.totalItems = totalItems || 0;
        this.current = paginator['@id'] || '';
        this.first = paginator['hydra:first'] || '';
        this.next = paginator['hydra:next'] || '';
        this.previous = paginator['hydra:previous'] || '';
        this.last = paginator['hydra:last'] || '';
        this.funcName = funcName;
        this.service = service;
        this.toCall = (page) => this.load(page);

        this.currentPageNo = this._getPageNofromUrl(this.current) || 1;
        this.firstPageNo = this._getPageNofromUrl(this.first) || 1;
        this.lastPageNo = this._getPageNofromUrl(this.last) || 1;
        this._loadPages();
        this.itemsPerPage = perPage;//Math.ceil(this.totalItems/this.lastPageNo) || 0;
        this.itemsPageStartIndex = ((this._getPageNofromUrl(this.current) ? (this._getPageNofromUrl(this.current) - 1) : 0) * 8) + 1;
        this.recordSummary = this._getRecordSummary();
        this.pageSummary = this._getPageSummary();
    }

    private _getRecordSummary() {
        // debugger
        let initRecord = this.itemsPerPage * (this.currentPageNo - 1);
        initRecord = initRecord < this.totalItems ? (initRecord + 1) : initRecord;
        let endRecord = this.itemsPerPage * (this.currentPageNo);
        endRecord = endRecord < this.totalItems ? endRecord : this.totalItems;
        return initRecord + ' - ' + endRecord + ' of ' + this.totalItems + ' Records';
    }

    private _getPageSummary() {
        return 'Page ' + this.currentPageNo + ' of ' + this.lastPageNo;
    }

    load(urlString: string) {
        // urlString;
        // debugger;
        // this.toCall(page);
        // return this.toCall(page);
        // page = page.replace(environment.serverURL,'');
        // return this.service[this.funcName](urlString);
        let search = new URL(urlString).search;
        return this.service[this.funcName](search);
    }

    loadByPageNo(pageNo: number) {
        let pageString = this._getUrlFomPageNo(pageNo);
        if (pageString) {
            this.load(pageString);
        }
    }

    private _loadPages() {
        let i = 1;//this.firstPageNo;
        for (i; i <= this.lastPageNo; i++) {
            const element = this.lastPageNo[i];
            this.pages.push({ label: i, value: this._getUrlFomPageNo(i) })
        }
    }

    private _getUrlFomPageNo(pageNo: number): string {
        if (pageNo > this.lastPageNo) {
            // err;
            return;
        }
        let url = new URL(environment.serverURL + this.current);
        url.searchParams.set('page', pageNo.toString());
        return url.toString();
    }
    private _getPageNofromUrl(urlString: string): number {
        // debugger;
        let url = new URL(environment.serverURL + urlString);
        let pageNo = url.searchParams.get('page');
        return toInteger(pageNo);
    }

    isPaginated():boolean{
        return this.current ? true : false;
    }
}