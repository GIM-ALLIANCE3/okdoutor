import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private messageService: MessageService) { 
    localStorage.clear();
  }

  ngOnInit(): void {
    this.messageService.clear();
  }
   
  setBeforePage(url: string){
    localStorage.setItem('beforePage', url);
  }
}
