import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {
  processId: string = ''

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.processId = this.route.snapshot.paramMap.get('id') || ""
  }

}
