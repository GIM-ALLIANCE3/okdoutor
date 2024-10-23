import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-your-dialog',
  template: `
    <p>
      {{message}}
    </p>
  `,
  styles: []
})
export class DialogMessageComponent {
  message: string | undefined | null = null;

  constructor(@Inject(DynamicDialogConfig) public config: DynamicDialogConfig) {
    this.message = config.data.message;
  }


  ngOnInit(): void {
  }
}
