import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Stromverbrauch';

  isCollapsed: boolean;
  

  constructor(private _router: Router){
    this.isCollapsed = true;
    d3.timeFormatDefaultLocale({
      "dateTime": "%A, der %e. %B %Y, %X",
      "date": "%d.%m.%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    })
  }

  toggleCollapse(){
    this.isCollapsed = !this.isCollapsed;
  }

  change(id: string){
    document.getElementsByClassName('active').item(0).classList.remove('active');
    document.getElementById(id).classList.add('active');
    this.toggleCollapse();
    this._router.navigate([id])
    
  }
}
