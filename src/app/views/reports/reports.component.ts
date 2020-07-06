import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { CategoryService } from '../category/category.service';
import { ToastrService } from 'ngx-toastr';
import { BookingsService } from '../bookings/bookings.service';
import {formatDate} from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector   : 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls  : ['./reports.component.css'],
  providers  : [DatePipe]
})

export class ReportsComponent implements OnInit {
  is_loading: boolean = false;
  
  BookingsList: any[];
  DetailsList: any[]=[];
  calendarEvents: any[];
  p: any;
  reportFromTime: any;
  reportToTime: any;
  myDate: string;

  constructor(
    private router: Router,
    public http: Http,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private bookingService : BookingsService,
    private route: ActivatedRoute ,
    private datePipe: DatePipe) {  
    this.myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
   
    ngOnInit() {
      console.log(this.myDate);
      this.getEventForReports(this.myDate,this.myDate);
    }

    currentPageLoad() {
      this.pageChanged();
    }
  
    pageChanged() {
      this.is_loading = true
      this.DetailsList = []
      this.router.navigate(['/reports/reports'])
      this.getEventForReports(this.reportFromTime,this.reportToTime);
    }

    getBookingsList() {
      this.is_loading = true;
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
    
    getReportFromTime(value){
      this.reportFromTime = value
      if(!(this.reportToTime ==null)){
        this.pageChanged()
      }
    }

    getReportToTime(value){
      this.reportToTime = value
      if(!(this.reportFromTime ==null)){
        console.log("Srike ")
        this.pageChanged() 
      }
    }
    
    getEventForReports(from,to){
      this.is_loading = true;
      console.log("From: "+ from+ " To:"+to)
      this.bookingService.getBookingEventByDate(from, to )
      .then(
        res => {
          if (res && res['success']) {
            this.is_loading = false
            console.log("Its a success"); 
            console.log(res['data']);
            this.BookingsList =[]
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

}
