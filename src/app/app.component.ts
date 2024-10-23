import { Component } from '@angular/core';
import { LoadingService } from './service/loading.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web';
  isLoading: boolean = false;
  isNotify: boolean = false;

  constructor(private loadingService: LoadingService, private messageService: MessageService, private router: Router) {
    this.loadingService.notificarConfirmacao();
    this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
    });

    this.loadingService.notify$.subscribe(status => {
      this.isNotify = status;
    });

    // on route change
    this.router.events.subscribe(() => {
      this.loadingService.notificarConfirmacao();
      this.messageService.clear('block2');
    });
  }

  clear(key: string) {
    this.messageService.clear(key);
    this.loadingService.notificarConfirmacao();
  }

  goToUrl(url: string) {
    window.open(url, '_blank');
  }
}
