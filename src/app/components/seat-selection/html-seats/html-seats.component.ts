import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { toInteger } from 'lodash';
import { SelectContainerComponent } from 'ngx-drag-to-select'
import { Seat } from '../../../models/seat.model';
import { Cabin } from '../../../models/cabin.model';

@Component({
    selector   : 'html-seats',
    templateUrl: './html-seats.component.html',
    styleUrls  : ['./html-seats.component.scss']
})
export class HtmlSeatsComponent implements OnInit, OnDestroy, AfterViewInit
{

    cabinForm: FormGroup;

    // Seates Array

    businessSeatList : any = [];
    economySeatList : any = [];

    toolBarForm: FormGroup = this._formBuilder.group({
        selectMode: ['single'],
    }); 

    selectedIndexedSeatForm: any = {}; 

    selectedSeats=[];
    selectSeat(e: any){
        console.log(e);
    }

    selectedSeat : string = '';

    sels: any[]=[];

    documents: Array<any> = []; 
    // selectedDocuments: Array<any> = [];
    set selectedDocuments(doc:Array<any>){
        console.log('selected......',doc);
        this.sels = doc;

        if(!this.isControlDown){
            this.selectedIndexedSeatForm = {};
        }
        
        // if(doc.length>0 && this.toolBarForm.value.selectMode =='single'){
        //     debugger;
        //     this.toolBarForm.controls.selectMode.patchValue('multiple');
        //     this.toolBarForm.controls.selectMode.markAsDirty();
        // }

        this.sels.forEach((seatForm: FormGroup)=>{
            let row = seatForm.value.seatRow;
            let col = seatForm.value.seatColumn;
            let seatKey: string = col+row;
            // this.onSeatClick(seatForm,key);
            if(!this.selectedIndexedSeatForm[seatKey]){
                this.selectedIndexedSeatForm[seatKey]=seatForm;
            }else{
                // delete this.selectedIndexedSeatForm[seatKey];
            }
        })
    }
    get selectedDocuments(){
        return this.sels;
    }

    selectOnDrag = true;
    selectMode = false;
    disable = false;
    disableRangeSelection = false;
    isDesktop = false;
    selectWithShortcut = false;
    dragOverItems = true;
    onDCS = false;
    // Private
    @Input() set OnDCS(onDCS: boolean){
        this.onDCS = onDCS;
        if (onDCS){
            this.selectMode = false;
            this.selectOnDrag = false;
            this.dragOverItems = false;
            this.selectWithShortcut = false;
            this.disableRangeSelection = true;
        }
    }

    @Input() seatSelectionForm!:FormGroup;

    @Input()
    set CabinForm(cabinForm: FormGroup){
        let seats = cabinForm.getRawValue().seats;

        let businessSeates = seats.filter((x : any) => x.cabinClass == '/api/cabin_classes/2')
        .sort((a : any, b : any) => a.seatRow - b.seatRow);

        let economySeates : any = seats.filter((x : any) => x.cabinClass == '/api/cabin_classes/1')
        .sort((a : any, b : any) => a.seatRow - b.seatRow);

        for(let i = businessSeates[0].seatRow; i <= businessSeates[businessSeates.length - 1].seatRow; i++){
            let row = businessSeates.filter((x : any) => x.seatRow == i);
            this.businessSeatList.push(row);
        }

        for(let c = economySeates[0].seatRow; c <= economySeates[economySeates.length - 1].seatRow; c++){
            let row = economySeates.filter((x : any) => x.seatRow == c);
            this.economySeatList.push(row);
        }
        // .sort((a : any, b : any) => a.seatColumn.localeCompare(b.seatColumn));

        // console.log('My Cabin Form',this.economySeatList);

        this.cabinForm = cabinForm;
        this.setupUI();
        this.cabinForm.valueChanges
            .subscribe(val=>this.setupUI())
    }

    // return this.data.sort((a, b) => {
    //     return new Date(a.CREATE_TS) - new Date(b.CREATE_TS);
    //   });

    reservedSeats: any[] = [];
    blockedSeats: any[] = [];
    @Input()
    set ReservedSeats(reservedSeats: any){
        this.reservedSeats = reservedSeats;
        this.updateModels();
    }

    @Input()
    set BlockedSeats(blockedSeats: any){
        this.blockedSeats = blockedSeats;
        this.updateModels();
    }

    @Output() mySelectectSeat = new EventEmitter<string>();

    maxRows: number = 0;
    maxCols: number = 0;
    columns: string[] = [];

    seatsModel: any; //{number:{string:FormGroup}};//row.col.seatForm
    touchTime = 0;

    /**
     * Constructor
     *
     */
    constructor(
        private _formBuilder: FormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.toolBarForm.valueChanges
            .subscribe((data:any)=>{
                // if(data.selectMode == 'single')
                this.selectedIndexedSeatForm = {};
            });
        
        for (let id = 1; id <= 12; id++) {
            this.documents.push({
                id,
                name: `Seat ${id}`,
            });
        }

    }


    /**
     * On afterview init
     */
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this._onScroll(null);
    } 

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }

    setupUI(){
        this.seatsModel = this.generateModels(this.cabinForm.get('seats') as FormArray);
        
        let ailesFormat = this.cabinForm.controls['ailesFormat'].value;
        if(ailesFormat){
            let arr = this.cabinForm.controls['ailesFormat'].value.split('');
            let err = false;
            this.columns.forEach(col=>{
                if(!arr.includes(col)){
                    //notify
                    err = true;
                    window.alert('Seat exists with col: '+ col +' which is not found in ailesFormat: '+ailesFormat);
                }
            });
            if(!err){
                this.columns=arr;
            }
        }
        //console.log("Modeled Seats",this.seatsModel);
    }

    get SeatsFormArray(): FormArray{
        return this.cabinForm.get('seats') as FormArray;
    }

    generateModels(seats: FormArray): any{
        this.maxRows=0;
        this.maxCols=0;
        this.columns=[];
        let result: any = {};
        seats.controls.forEach((seatForm: FormGroup)=>{
            let row = seatForm.controls['seatRow'].value;
            let col = seatForm.controls['seatColumn'].value;
            if(!this.columns.includes(col)){
                this.columns.push(col);
            }

            if(!result[row]){
                result[row]={};
            }
            result[row][col]=seatForm;
        });
        this.columns = this.columns.sort();
        return result;
    }

    updateModels(): any{
        this.reservedSeats.forEach((reservedSeat)=>{
            this.seatsModel[reservedSeat.seat.seatRow][reservedSeat.seat.seatColumn].controls.isReserved.patchValue(true);
        });
        this.blockedSeats.forEach((blockedSeat)=>{
            this.seatsModel[blockedSeat.seat.seatRow][blockedSeat.seat.seatColumn].controls.isBlocked.patchValue(true);
        });
    }

    openCabinSeatDialogue(){
        console.log('no dialog to open. may cange to select save');
    }

    onSeatSelectedClick(seat : any) {
        // console.log('Selected Seat',seat);
        this.mySelectectSeat.emit(seat.name);
        this.selectedSeat = seat.name;
        this.seatSelectionForm.controls['seat'].patchValue(seat.iri,{emitEvent:true});
        // console.log('Submit Form Data', this.seatSelectionForm)
    }
    onSeatClick(seatForm:FormGroup,seatKey:string): void {
        
        // compare first click to this click and see if they occurred within double click threshold
        if (((new Date().getTime()) - this.touchTime) < 800) {
            // double click occurred
            this.onSeatDoubleClick(seatForm, seatKey);
            this.touchTime = 0;
        } else {
            // not a double click so set as a new first click
            console.log('seatClicked: ', seatKey);
            this.mySelectectSeat.emit(seatKey)
            // this.hoverX = e.x;
            // this.hoverY = e.y+200;
            
            // this.hoveredSeatKey =  seatKey;
            // this.hoveredSeatForm = this.indexedCabinForm[seatKey];

            // this.showHoverPanel=false;
            // this.cd.detectChanges();

            // let seatEl = this.svgEl.getSVGDocument().getElementById(seatId);

            let selectMode = this.toolBarForm.controls['selectMode'].value;
            switch (selectMode) {
                case 'single':
                    this.selectedIndexedSeatForm = {};
                    this.selectedIndexedSeatForm[seatKey]=seatForm;
                    if(this.onDCS){
                        // emit event back to parent
                        this.seatSelectionForm.controls['seat'].patchValue(seatForm.getRawValue().iri,{emitEvent:true});
                        break;
                    }
                    this.openCabinSeatDialogue();
                    break;
                case 'multiple':
                    if(!this.selectedIndexedSeatForm[seatKey]){
                        this.selectedIndexedSeatForm[seatKey]=seatForm;
                    }else{
                        delete this.selectedIndexedSeatForm[seatKey];
                    }
                    break;
                default:
                    break;
            }
            this.touchTime = new Date().getTime();
        }
    }

    onSeatDoubleClick(seatForm:FormGroup,seatKey:string): void {
        console.log('seatDoubleClicked: ', seatKey);
        this.selectedIndexedSeatForm = {};
        this.selectedIndexedSeatForm[seatKey]=seatForm;
                
        if(this.onDCS){
            // emit event back to parent
            this.seatSelectionForm.controls['seat'].patchValue(seatForm.getRawValue().iri,{emitEvent:true});
            this.seatSelectionForm.controls['submit'].patchValue(true,{emitEvent:true});
            this.seatSelectionForm.controls['seat'].markAsDirty();
        } 
    }
    
    indexOrderAsc = (akv: KeyValue<number, any>, bkv: KeyValue<number, any>): number => {
        const a = toInteger(akv.key);
        const b = toInteger(bkv.key);
        return a > b ? 1 : (b > a ? -1 : 0); // ASCENDING
        // return a > b ? -1 : (b > a ? 1 : 0); // DESCENDING
    };
    
    colOrderAsc = (akv: KeyValue<number, Seat>, bkv: KeyValue<number, Seat>): number => {
        const a = akv.value.seatColumn;
        const b = bkv.value.seatColumn;
        return a > b ? 1 : (b > a ? -1 : 0); // ASCENDING
        // return a > b ? -1 : (b > a ? 1 : 0); // DESCENDING
    };

    @HostListener('window:scroll', ['$event']) public 
    windowScrolled($event: Event) {
        this._onScroll($event);
    }

    @ViewChild(SelectContainerComponent,{static:false}) dtsContainer!: SelectContainerComponent;

    _onScroll(event:any) {
    // I send it to a "scroll observable" to use it with debounceTime( 5 )
    console.log('updating..')
    this.dtsContainer.update();
    }


    isControlDown: boolean = false;
    onControlDown(e:any){
        this.isControlDown = true;
    }
    onControlRelease(e:any){
        this.isControlDown = false;
    }

    //
    @HostListener('window:keydown', ['$event']) 
    windowKeydown($event: KeyboardEvent) {
        console.log('keydown',$event)
        if($event.key=='Control'){
            if(this.toolBarForm.value.selectMode!=='multiple'){
                debugger
                this.toolBarForm.controls['selectMode'].patchValue('multiple');
                this.toolBarForm.controls['selectMode'].markAsDirty();
            }
            this.isControlDown = true;
        }
    }
    @HostListener('window:keyup', ['$event']) 
    windowKeyup($event: KeyboardEvent) {
        console.log('keyup',$event)
        if($event.key=='Control'){
            this.isControlDown = false;
        }
    }

}
