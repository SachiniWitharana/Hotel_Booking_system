import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
//import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { OptionsManager } from '@fullcalendar/core/OptionsManager';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { RoomsService} from '../../add-space/rooms.service'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { CategoryService } from '../../category/category.service';
import { ToastrService } from 'ngx-toastr';
import { BookingsService } from '../bookings.service';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { InputElement } from './inputElements';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { formatTimeZoneOffset } from '@fullcalendar/core/datelib/formatting';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from 'querystring';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';

declare var $:any;
@Component({
  selector: 'app-day',
  templateUrl: 'day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
    @ViewChild('primaryModal') public primaryModal: ModalDirective;
    @ViewChild('detailModal') public detailModal: ModalDirective;
    @ViewChild('activeModal') public activeModal: ModalDirective;
    @ViewChild('external') external: ElementRef;
      
      calendarVisible = true;
      calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin,listPlugin,resourceTimelinePlugin,bootstrapPlugin];
      calendarWeekends = true;
      resourcecolumns = [
        {
          labelText: 'Room',
     
          field: 'room_number'
        }
      ];
      resourcelist = [];

      calendarEvents: EventInput[] = [];

      rooms: any[];
      roomList :any[]=[];

      inputelements = [{id: 'number',roomNumber: 'string',checkin:'string',checkout:'string', price:'string'}];

      public form:{
        inputelements :InputElement[];
      };
      
      room_id  : string;
      check_in : string;
      check_out: string;
      checkin_value: any;
      checkout_value: any;
      checkin: any;
      price  :number;

      isDisabled=false;

      is_loading = false
      is_page_loading = false;
      inputelement: any;
      inputelementcheckin: any;
      inputelementcheckout: any;
      eventBgColor: string;
      height: number;
      contentHeight: number;
      resourceAreaWidth: number; 
      eventStartEditable: boolean;
      eventDurationEditable: boolean;
      dragRevertDuration: boolean;
      defaultView: string;
      showModal: boolean;
      eventLimit: true;
      name:string;
      date:string;
      personsForm: FormGroup;
      calendarOptions: OptionsManager;
      owlDateTimeTrigger: string;
      owlDateTime:string;

      index : any;

      navLinks: true; // can click day/week names to navigate views
      businessHours: true;// display business hours
      editable: true;
  
      navLinkDayClick= function(date, jsEvent) {
        console.log('day', date.toISOString());
        console.log('coords', jsEvent.pageX, jsEvent.pageY);
      }

      separateDialCode = true;
      SearchCountryField = SearchCountryField;
      TooltipLabel = TooltipLabel;
      CountryISO = CountryISO;
      preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

      BookingsList: any[];
      DetailsList: any[]=[];
      EventDetail: any[]=[];

      selected_room_number: any;
      selected_reservation_date: any;
      selected_reservaton_time: any;
      selected_client_name: any;
      selected_room_price: any;
      selected_dial_code: any;
      selected_mobile: any;
      selected_employee: any;
      selected_date: any;
  
      DetailsBookingList: any[]=[];
      selected_checkin: any;
      selected_checkout: any;
      total: number = 0;
      total_price: number;
      total_detail_price: any;
  selected_check_checkedout: any;
  selected_event_id: any;

      constructor(
        private roomService:RoomsService,
        private router: Router,
        private route: ActivatedRoute,
        public  http: Http,
        private bookingService : BookingsService,
        private categoryService :CategoryService,
        private toastr: ToastrService,
        public fb: FormBuilder
      ){
        this.form={
          inputelements: []
        };
      
        this.addInputElement();
      }
      
      ngOnInit(){
        this.isDisabled=false;
        this.getRoomsList();
        this.getEventList(); 
      }
    
      currentPageLoad() {
        this.router.navigateByUrl('/').then(
          () => {this.router.navigateByUrl('/bookings/day');});
      }

      toggleVisible() {
        this.calendarVisible = !this.calendarVisible;
      }
      
      toggleWeekends() {
        this.calendarWeekends = !this.calendarWeekends;
      }

      gotoPast() {
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
      }

      handleDateClick(arg) {
     
      }

        // eventClick(model: any) {
        //   this.name = model.event.title;
        //   this.date = model.event.date;
        //   this.showModal = true;
        // }

        // //When u select some space in the calendar do the following:
        // select= function (start, end, allDay) {
        //   //do something when space selected
        //   //Show 'add event' modal
        //   $('#createEventModal').modal('show');
        // }

        // //When u drop an event in the calendar do the following:
        // eventDrop= function (event, delta, revertFunc) {
        //     //do something when event is dropped at a new location
        // }

        // //When u resize an event in the calendar do the following:
        // eventResize= function (event, delta, revertFunc) {
        //     //do something when event is resized
        // }

        // eventRender= function(event, element) {
        //     $(element).tooltip({title: event.title});             
        // }

        // addMore() {
        //   this.inputelements.push({roomNumber: '',checkin:'',checkout:''});
        // }

     
        // get demoArray() {
        //   return this.demoForm.get('demoArray') as FormArray;
        // }
        
        // addItem(item) {
        //     this.arrayItems.push(item);
        // }

        // removeItem() {
        //     this.arrayItems.pop();
        //     this.demoArray.removeAt(this.demoArray.length - 1);
        // }

        // registrationForm = this.fb.group({
        //   addDynamicElement: this.fb.array([])
        // })

          //   /*############### Add Dynamic Elements ###############*/
          //   get addDynamicElement() {
          //     return this.registrationForm.get('addDynamicElement') as FormArray
          //   }

          // addItems() {
          //   this.addDynamicElement.push(this.fb.control(''))
          // }

          getRoomsList() {
            this.roomService.getRooms(1, 1000).then(
              res => {
                if (res['success']) {
                  this.resourcelist = res['data'];
                  for(var i = 0; i < this.resourcelist.length; i++) {
                    if (this.resourcelist[i].is_active == true) {
                      this.roomList.push(this.resourcelist[i]);
                    }
                  }
                  console.log( this.roomList);
                  return this.roomList;         
                }
              },
              err => {
                console.log(err);
              }
            );
          }

      getRoomID(id){
        console.log(id);
        this.room_id = id
      }

      getRoomPrice(value){
        this.price = value;
        this.total = +this.total + +this.price;
        this.total_price = this.total
        console.log("Total "+this.total);
      }

      getCheckInTIme(value){
        var todaysDatee = new Number(new Date());
         this.check_in = value;       
        if(Date.parse(this.check_in)< todaysDatee ){
          this.toastr.error('Oops! Make sure date is not a past date');
          this.checkin  = null;
        }
      }

      getCheckOutTIme(value){
        this.is_loading = true
        this.check_out = value;
        console.log("TIME Out" +this.check_out);
        let model = {
          room    : this.room_id,
          checkin : this.check_in,
          checkout: this.check_out
        }    
        this.bookingService.checkCheckInOutTime(model).then(
          res => {
            this.is_loading = false
            if (res['validity']) {
              this.toastr.success('Room is available!');
              this.isDisabled = false;
              
            } else {
              this.toastr.error('Oops!There is a booking made at this time');
              this.inputelementcheckin  = null;
              this.inputelementcheckout = null;
            }
          },
          err => {
            this.is_loading = false
            this.toastr.error('Oops! Internal Server Error');
          }
        );
      }

    public addInputElement(): void{
      this.form.inputelements.push({
        id         : Date.now(),
        room_number: "" ,  // <--- uniqueness hook.
        checkin    : "" ,
        checkout   : "" ,
        price      : ""
    });
   }

    public processForm( form: any ) : void {

      let intDate = +new Date()
      this.is_loading = true
      console.warn( "Handling form submission!" );
   
      console.group( "Form Data" );
      console.log( this.form.inputelements );
      console.groupEnd();
   
      console.group( "Form Model" );
      console.log( form );
      console.groupEnd();

      var client_name = form.controls['client_name'].value;
      var nic = form.controls['nic'].value;
      var mobile = form.controls['phone'].value;
      var countryCode = mobile.dialCode;
      var phone = mobile.number.replace(/\s/g, ""); ;
      
      let model ={
        "client":{
          name: client_name,
          nic : nic,
          country_code : countryCode,
          mobile : phone
        },
        "reservation":{
          checkin: this.check_in,
          total  : this.total
        },
        "detail":[
          {
            checkin :this.check_in,
            checkout:this.check_out,
            room    :this.room_id,
            price   :this.price
          }
        ]
      }
      this.total_price = this.total
      console.log("model"+model);
      this.bookingService.saveBookings(model).then(
        res => {
          if (res['success']) {
            this.is_loading = false 
            this.toastr.success('Successfully Added!');
            form.resetForm();   
            this.primaryModal.hide();
            this.currentPageLoad();
          } else {
            this.is_loading= false
            this.toastr.error('Oops! Can not add bookings at this moment please try again later');
          }
        },
        err => {
          this.is_loading = false
          this.toastr.error('Oops! Internal Server Error');
        }
      );

    }

	public removeInputElement( index: number ) : void {
    if(!(this.form.inputelements.length <= 1)){
		     this.form.inputelements.splice( index, 1 );
    }
  }

  getEventList(){
    this.is_loading = true
    this.bookingService.getBookingEventsList()
    .then(
      res => {
        if (res && res['success']) {
          this.is_loading = false
          console.log("Its a success"); 
          console.log(res['data']);
          this.BookingsList = res['data'];
          console.log("22");
          this.BookingsList.forEach(data=>{
            data.details.forEach(detailslist=>{
              this.DetailsList.push(detailslist); 
            });
          });
          console.log(this.DetailsList);
          this.calendarEvents= this.DetailsList;
          return this.DetailsList;
        }
        else {
          this.toastr.error('Oops! Can not get item this moment please try again later');
        }
      },
      err=>{
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

  showModel(id){
    this.detailModal.show();
    this.getEventDetails(id);
    
  }
 
  eventClick(info){
    // alert('Event: ' + info.event.id);
     // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    // alert('View: ' + info.view.type); 
    // change the border color just for fun
    // info.el.style.borderColor = 'red';
    this.is_loading = true;

    this.bookingService.getBoookingEventDetail(info.event.id)
    .then(
      res => {
        if (res && res['success']) {
          for(let i=0; i <= this.DetailsBookingList.length ;i++){
            this.DetailsBookingList.pop();
          }
          this.is_loading = false
          this.EventDetail = res['data'];
          console.log(this.EventDetail);
          this.selected_client_name = this.EventDetail[0]["client"]
          this.selected_dial_code = this.EventDetail[0]["details"]["country-code"]
          this.selected_mobile= this.EventDetail[0]["details"]["mobile"]
         
          this.selected_employee = this.EventDetail[0]["user"]

          this.selected_room_number = this.EventDetail[0]["details"]["title"]
          this.selected_checkin = this.EventDetail[0]["details"]["start"]
          this.selected_checkout= this.EventDetail[0]["details"]["end"]

          this.selected_date = info.event.date
          this.selected_check_checkedout = this.EventDetail[0]["is_checkedout"]
          this.EventDetail.forEach(data=>{
            data.details.forEach(detailsbookinglist=>{
              this.DetailsBookingList.push(detailsbookinglist); 
            });
          });
          this.total_detail_price = this.EventDetail[0]["total"]  
          this.selected_event_id = this.EventDetail[0]["id"]  
          this.detailModal.show();
                 
        }
        else {
          this.toastr.error('Oops! Can not get item this moment please try again later');
        }
      },
      err=>{
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

  getEventDetails(id){
    console.log("Id "+id);
    //this.is_loading = true
    // this.bookingService.getBoookingEventDetail(id)
    // .then(
    //   res => {
    //     if (res && res['success']) {
    //       this.is_loading = false
    //       this.EventDetail = res['data'];
    //       console.log("22");
    //       // this.BookingsList.forEach(data=>{
    //       //   data.details.forEach(detailslist=>{
    //       //     this.DetailsList.push(detailslist); 
    //       //   });
    //       // });
    //       // console.log(this.DetailsList);
    //       // this.calendarEvents= this.DetailsList;
    //       // return this.DetailsList;
    //     }
    //     else {
    //       this.toastr.error('Oops! Can not get item this moment please try again later');
    //     }
    //   },
    //   err=>{
    //     this.is_loading = false
    //     this.toastr.error('Oops! Internal Server Error');
    //   }
    // );
  }

  cancelEve(info){
    console.log(info)
  }
  showCancelMde(){
    this.detailModal.hide();
    this.activeModal.show();
  }

}